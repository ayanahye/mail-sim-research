import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="fake-key"
)

def clean_and_extract_replies(raw_replies):
    pattern = r'\(\w+\):\s*"(.*?)"(?:<\|eot_id\|>)?'
    matches = re.findall(pattern, raw_replies)
    cleaned_replies = [match.replace('"', '').replace("'", '').strip() for match in matches]
    
    while len(cleaned_replies) < 3:
        cleaned_replies.append("No response provided")
    
    return cleaned_replies

# makes 3 requests instead of 1... in the endpoint above
# returns a 500 error

@app.route('/api/get-ai-replies', methods=['POST'])
def get_ai_replies():
    data = request.json
    patient_message = data.get('patientMessage', '') 

    if not patient_message:
        return jsonify({"error": "Patient message is required."}), 400

    prompt = f"""
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
        1. **First reply** (Informative): "Hello there, (informative response), Kind regards, Nurse ___."
        2. **Second reply** (Suggestive): "Hello there, (suggestive response), Kind regards, Nurse ___."
        3. **Third reply** (Redirective): "Hello there, (redirective response), Kind regards, Nurse ___."
        """

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3"
    )

    raw_replies = chat_completion.choices[0].message.content
    
    cleaned_replies = clean_and_extract_replies(raw_replies)
    
    labels = ["Informative", "Suggestive", "Redirective"]
    
    formatted_replies = [
        {
            "label": labels[i],
            "content": f'{cleaned_replies[i]} Note: This email was drafted with AI assistance and reviewed/approved by the nurse.'
        }
        for i in range(3)
    ]

    print(formatted_replies)

    return jsonify({"aiReplies": formatted_replies})


@app.route("/api/regenerate-ai-reply", methods=['POST'])
def regenerate_ai_reply():
    data = request.json
    patient_message = data.get("patientMessage", "")
    active_tab = data.get("activeTab", 0)

    if not patient_message:
        return jsonify({"error": "Patient message is required."}), 400

    prompt = f"""
    Respond to the following message from an upset and angry patient as if you were their nurse. BE CONCISE. The patient’s message may include frustration, concerns, or questions because they are upset. Your response must strictly adhere to the following structure:

    1. **Template**: "Hello there, (your reply here), Kind regards, Nurse ___."
    2. **Tone**: Maintain a professional, empathetic, and supportive tone at all times.
    3. **No placeholders**: Do not use any placeholders like `(your reply here)` in your response. The response must directly address the patient's concerns or queries.

    The response should be in one of these categories:
    1. **Informative**: Provide helpful information about procedures, policies, or next steps.
    2. **Suggestive**: Suggest next steps or actions the patient can take.
    3. **Redirective**: Redirect the issue to appropriate resources if needed.

    **Patient Message:** "{patient_message}"

    Generate only one response based on this category: {["Informative", "Suggestive", "Redirective"][active_tab]}.
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3"
        )
        raw_reply = chat_completion.choices[0].message.content

        cleaned_reply = (
            raw_reply.replace('"', '')
            .replace("'", '')
            .replace("<|eot_id|>", '')  
            .strip()
        )

        print(raw_reply)

        formatted_reply = {
            "label": ["Informative", "Suggestive", "Redirective"][active_tab],
            "content": f"{cleaned_reply} Note: This email was drafted with AI assistance and reviewed/approved by the nurse."
        }

        return jsonify({"aiReply": formatted_reply})
    except Exception as e:
        print("Error in regenerate_ai_reply:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

'''
Notes (talk w prof)
- Sometimes model does not allow itself to return a response due to "negative" nature/potential hate speech
- Discuss potential of using 2 diff models 1 larger 1 smaller and then comparing the results with half nurses each
- Are the labels correct?

My notes
- llm finally gives consistent replies
- still doesnt respond to first message because it thinks it is "hate speech"

- todo later: database functionality
'''
