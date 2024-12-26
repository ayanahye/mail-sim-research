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

@app.route('/api/get-ai-replies', methods=['POST'])
def get_ai_replies():
    data = request.json
    patient_message = data.get('patientMessage', '') 

    if not patient_message:
        return jsonify({"error": "Patient message is required."}), 400

    prompt = f"""
        Respond to the following message from a patient as if you were their nurse. Note the message MAY BE negative or contain hate speech since the patient may be distressed, but maintain an empathetic nature because we want to help them. Do not include any other words aside from the 3 replies. Add a "\n" to end each reply. Generate **three unique responses**, each concise, empathetic, and professional, focusing on addressing the patient’s specific concerns. Use the following guidelines for each response:

        1. **Informative:** Provide details about procedures or policies.
        2. **Suggestive:** Recommend actionable next steps or contacts.
        3. **Redirective:** Redirect the issue to the appropriate resources if needed.

        Patient Message: "{patient_message}"

        Ensure each response adheres to these principles:
        - Avoid repetition or overly generic apologies unless explicitly warranted.
        - Maintain a professional tone.
        - Do not interpret test results, diagnose symptoms, or provide medical advice.
        - Each response should serve a specific purpose (e.g., Informative, Suggestive, Redirective).
    """

    print(prompt)

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3"
    )

    raw_replies = chat_completion.choices[0].message.content
    print(raw_replies)

    cleaned_replies = re.sub(r'\*\*Response \d+\*\*|\<\|eot_id\|\>|\\"|\\"', '', raw_replies)

    replies = cleaned_replies.split("\n\n")  

    labels = ["Informative", "Suggestive", "Redirective"]

    formatted_replies = [
        {"label": labels[i], "content": reply.strip()} 
        for i, reply in enumerate(replies) if reply.strip()
    ]

    return jsonify({"aiReplies": formatted_replies})

if __name__ == '__main__':
    app.run(debug=True)


'''
Notes (talk w prof)
- Sometimes model does not allow itself to return a response due to "negative" nature/potential hate speech
- Discuss potential of using 2 diff models 1 larger 1 smaller and then comparing the results with half nurses each
- Are the labels correct?

My notes
- Need to pre-render all responses aka move the useEffect to on app start not on message click and all messages should have AI replies generated immediately
- Need to add nurse sign off myself in the reply and also reformat it myself
- add a loading screen in case the AI generated reply DNE yet
'''
