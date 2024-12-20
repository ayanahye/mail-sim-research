from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "This is a test message."})

if __name__ == '__main__':
    app.run(debug=True)