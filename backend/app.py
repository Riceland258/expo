from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__, static_folder=None)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Permitir solo ciertos archivos

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/subir', methods=['POST'])
def subir():
    if 'foto' not in request.files:
        return jsonify({'ok': False, 'error': 'No file part'})
    file = request.files['foto']
    if file.filename == '':
        return jsonify({'ok': False, 'error': 'No selected file'})
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # Evitar sobrescribir archivos
        i = 1
        base, ext = os.path.splitext(filename)
        while os.path.exists(save_path):
            filename = f"{base}_{i}{ext}"
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            i += 1
        file.save(save_path)
        return jsonify({'ok': True, 'filename': filename})
    return jsonify({'ok': False, 'error': 'Invalid file'})

@app.route('/fotos')
def fotos():
    files = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if allowed_file(f)]
    return jsonify(files)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
