# app.py
import os
import json
from flask import Flask, request, jsonify
from docx import Document
import PyPDF2
from werkzeug.utils import secure_filename
import traceback

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
            return text
    except Exception as e:
        print(f"Error extracting PDF text: {str(e)}")
        return None

def extract_text_from_docx(docx_path):
    try:
        doc = Document(docx_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error extracting DOCX text: {str(e)}")
        return None

@app.route('/convert', methods=['POST'])
def convert_pdf_to_text():
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            
            # Ensure upload directory exists
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Save the uploaded file
            file.save(file_path)
            
            # Extract text based on file type
            file_extension = os.path.splitext(filename)[1].lower()
            if file_extension == '.pdf':
                extracted_text = extract_text_from_pdf(file_path)
            elif file_extension in ['.docx', '.doc']:
                extracted_text = extract_text_from_docx(file_path)
            else:
                return jsonify({'error': 'Unsupported file type'}), 400

            # Clean up - remove the temporary file
            os.remove(file_path)
            
            if extracted_text is None:
                return jsonify({'error': 'Failed to extract text'}), 500

            return jsonify({
                'file_name': filename,
                'content': extracted_text
            })
            
        return jsonify({'error': 'Invalid file type'}), 400

    except Exception as e:
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)