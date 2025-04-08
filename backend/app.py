from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI

'''
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="fake-key"
)

@app.route('/api/data', methods=['GET'])
def get_data():
    chat_completion = client.chat.completions.create(
        messages=[{
            "role": "user",
            "content": """
                Respond to the following message from a patient as if you were their nurse. Your response should be concise, empathetic, and professional, focused on addressing the patient’s specific concerns. Choose from the following actions based on the situation (only choose relevant action(s)):

                Informative: Provide clear details about procedures, policies, or prior care relevant to the patient’s concerns without over-explaining.
                Suggestive: Recommend next steps, such as scheduling an appointment, contacting another department, or considering a specific action (e.g., follow-up).
                Redirection: Redirect urgent or specific issues to the appropriate crisis resources, departments, or specialists.
                Following-Up: Request additional details if necessary or promise follow-up when further discussions are needed.
                Avoid over-apologizing or generic reassurances unless the patient’s message specifically calls for them. Do not interpret test results, diagnose symptoms, or provide medical advice. Maintain a professional and empathetic tone even in the face of negative or critical messages. If the patient requests medication or treatment, ask that they schedule an appointment to review their request.

                Responses should focus on actionable support, ensuring the patient feels heard and guided toward resolution. Be very concise and NEVER repeat yourself.

                Patient: “So I have to tell you I’m pretty perturbed by this whole thing. I don’t care what the rules are, I think it’s pretty cra**y, that there couldn’t have been an exception regarding having the Covid test the morning before the procedure, considering all this cra* that could have been avoided, by you giving me the exact info, and your staff taking care of the insurance deal. Two trips up there again is a bit much. Why don’t you see what you can do about it? If not, why don’t you have one of these upper ups that make these rules give me a call.”
            """
        }],
        model="llama3"
    )

    return jsonify({"response": chat_completion.choices[0].message.content})

if __name__ == '__main__':
    app.run(debug=True)

'''

import os
import re
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from openai import OpenAI, OpenAIError

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="fake-key",
)

def clean_and_extract_replies(raw_replies):
    pattern = r'\*\*(.*?)\*\*: "(.*?)"'
    matches = re.findall(pattern, raw_replies)
    cleaned_replies = [{"label": match[0], "content": match[1].strip()} for match in matches]

    while len(cleaned_replies) < 3:
        cleaned_replies.append({"label": "No Response", "content": "No response provided."})

    return cleaned_replies


def extract_categories(raw_categories):
    pattern = r'\b(High Urgency|Medium Urgency|Low Urgency|Medication|Symptoms|Test-Related|Medical Questions|Acknowledgments|More Than One Issue)\b'
    matches = re.findall(pattern, raw_categories)
    return list(set(matches))  


@app.route('/api/get-ai-data', methods=['POST'])
def get_ai_data():
    data = request.json
    patient_message = data.get('patientMessage', '')

    print(patient_message)

    if not patient_message:
        return jsonify({"error": "Patient message is required."}), 400

    category_prompt = f"""
        Categorize the following patient message into relevant tags:
        Message: "{patient_message}"
        Categories: ["High Urgency", "Medium Urgency", "Low Urgency", "Medication", "Symptoms", "Test-Related", "Medical Questions", "Acknowledgments", "More Than One Issue"]
        Provide a comma-separated list of the most relevant categories. Return at most 3 and don't include anything else in your response.
        Provide at least 1 category. 
        Urgency always provide a category (always 1)
    """

    # mon april 7th on cmpus

    reply_prompt = f"""
        Respond to the following message from an upset and angry patient as if you were their nurse. BE CONCISE. The patient’s message may include frustration, concerns, or questions because they are upset. Your response must strictly adhere to the following structure:

        1. **Template**: "Hello there, (your reply here), Kind regards, Nurse ___."
        2. **Tone**: Maintain a professional, empathetic, and supportive tone at all times.
        3. **No placeholders**: Do not use any placeholders like `(your reply here)` in your response. The response must directly address the patient's concerns or queries.

        Follow these guidelines for each response:
        - **Informative**: Provide helpful information about procedures, policies, or next steps.
        - **Suggestive**: Suggest next steps or actions that the patient can take.
        - **Redirective**: Redirect the issue to appropriate resources if needed.

        Patient Message: "{patient_message}"

        Your response should be strictly in the following format (include the 3 response types as shown):
        1. **Informative**: "Hello there, (informative response), Kind regards, Nurse ___."
        2. **Suggestive**: "Hello there, (suggestive response), Kind regards, Nurse ___."
        3. **Redirective**: "Hello there, (redirective response), Kind regards, Nurse ___."
    """

    try:
        category_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": category_prompt}],
            model="llama3"
        )
        
        raw_categories = category_completion.choices[0].message.content.strip()
        categories = extract_categories(raw_categories)  
        print(1)
        print(categories)

        reply_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": reply_prompt}],
            model="llama3"
        )
        
        raw_replies = reply_completion.choices[0].message.content
        print("raw")
        print(raw_replies)
        cleaned_replies = clean_and_extract_replies(raw_replies)
        print(2)
        print(cleaned_replies)

        formatted_replies = [
            {
                "label": reply["label"],
                "content": f'{reply["content"]} Note: This email was drafted with AI assistance and reviewed/approved by the nurse.'
            }
            for reply in cleaned_replies
        ]

        return jsonify({"categories": categories, "aiReplies": formatted_replies})

    except OpenAIError as e:
        print("OpenAI API Error:", str(e))
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        print("Unexpected Error:", str(e))
        return jsonify({"error": "An unexpected error occurred."}), 500

@app.route('/api/regenerate-ai-reply', methods=['POST'])
def regenerate_ai_reply():
    data = request.json

    patient_message = data.get('patientMessage', '')
    category = data.get('category', '')
    prev_message = data.get('previousMessage', '')  
    ai_reply = data.get('aiReply', '')  
    subject = data.get('subject', '') 

    print(f"Category: {category}")
    print(f"Patient Message: {patient_message}")
    print(f"Previous Message: {prev_message}")
    print(f"Current AI Reply: {ai_reply}")

    if not patient_message:
        return jsonify({"error": "Patient message and category are required."}), 400

    prompt = f"""
        Respond to the following message from an upset and angry patient as if you were their nurse. BE CONCISE. The patient’s message may include frustration, concerns, or questions because they are upset. Your response must strictly adhere to the following structure:

        1. **Template**: "Hello there, (your reply here), Kind regards, Nurse ___."
        2. **No placeholders**: Do not use any placeholders like `(your reply here)` in your response.

        Generate only one response based on this category: {category}.

        Previous AI Reply (if applicable): "{ai_reply}"
        Previous Message (if applicable): "{prev_message}"

        Patient Message: "{patient_message}". Do not repeat the same reply change it significantly and be kind and understanding in your reply. Do not repeat the same reply. Change at least 5 words. Do not include anything else in your response.
    """

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3"
        )

        raw_reply = completion.choices[0].message.content.strip()

        formatted_reply = {
            "label": category,
            "content": f"{raw_reply} Note: This email was drafted with AI assistance and reviewed/approved by the nurse."
        }

        print(raw_reply)

        return jsonify({"aiReply": formatted_reply})

    except OpenAIError as e:
        print("OpenAI API Error:", str(e))
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        print("Unexpected Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/edit-ai-reply', methods=['POST'])
def edit_ai_reply():
    data = request.json

    patient_message = data.get('patientMessage', '')
    ai_reply = data.get('aiReply', '')
    edit_options = data.get('editOptions', {})

    print(f"Patient Message: {patient_message}")
    print(f"Current AI Reply: {ai_reply}")
    print(f"Selected Edit Options: {edit_options}")

    if not patient_message or not ai_reply or not edit_options:
        return jsonify({"error": "Patient message, AI reply, and edit options are required."}), 400

    selected_options = ', '.join([key for key, value in edit_options.items() if value])
    prompt = f"""
        Respond to the following message from an upset and angry patient as if you were their nurse. BE CONCISE. The patient’s message may include frustration, concerns, or questions because they are upset. Your response must strictly adhere to the following structure:

        1. **Template**: "Hello there, (your reply here), Kind regards, Nurse ___."
        2. **No placeholders**: Do not use any placeholders like `(your reply here)` in your response.

        Based on the following patient message and AI-generated reply, apply edits according to these options:
        {selected_options}

        Patient Message: "{patient_message}"
        Current AI Reply: "{ai_reply}"
        
        Provide an updated reply that adheres strictly to these instructions. Do not repeat the same reply. Change at least 5 words. Do not include anything else in your response.
    """

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3"
        )

        raw_reply = completion.choices[0].message.content.strip()

        print(raw_reply)

        formatted_reply = {"content": raw_reply}

        return jsonify({"editedReply": formatted_reply})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/api/provide-instructions', methods=['POST'])
def provide_instructions():
    data = request.json

    predefined_instructions = data.get('instructions', [])
    patient_message = data.get('patientMessage', '')

    print(f"Predefined Instructions: {predefined_instructions}")
    print(f"Patient Message: {patient_message}")

    if not predefined_instructions:
        return jsonify({"error": "At least one instruction must be provided."}), 400

    all_instructions = ", ".join(predefined_instructions)
    
    prompt = f"""
        Based on the following patient message, generate a reply that adheres strictly to these user-provided instructions:
        Instructions: "{all_instructions}"

        Your response must strictly adhere to the following structure:

        1. **Template**: "Hello there, (your reply here), Kind regards, Nurse ___."
        2. **No placeholders**: Do not use any placeholders like `(your reply here)` in your response.


        Patient Message: "{patient_message}"

        Provide a concise and empathetic response.
    """

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3"
        )

        raw_reply = completion.choices[0].message.content.strip()
        print(raw_reply)

        formatted_reply = {"content": raw_reply}

        return jsonify({"generatedReply": formatted_reply})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

