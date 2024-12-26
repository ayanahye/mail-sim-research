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

# initial test - its def much faster using llamafile

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="fake-key"
)

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

print(chat_completion.choices[0].message.content)


