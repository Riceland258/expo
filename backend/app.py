from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import random

UPLOAD_FOLDER = 'uploads'
PASSWORD = 'Pato'

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    return jsonify({'message': 'File uploaded successfully'})

@app.route('/gallery', methods=['GET'])
def gallery():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify({'images': files})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/draw', methods=['POST'])
def draw():
    data = request.get_json()
    if not data or data.get('password') != PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    if not files:
        return jsonify({'error': 'No images available'}), 404
    winner = random.choice(files)
    return jsonify({'winner': winner})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
