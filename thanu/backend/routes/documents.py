from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models.document import Document
from utils.document_processor import DocumentProcessor
import os
import uuid

documents_bp = Blueprint('documents', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    try:
        user_id = get_jwt_identity()
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Create upload directory if it doesn't exist
        upload_dir = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        
        # Extract text content
        content = DocumentProcessor.extract_text(file_path, filename)
        
        if not content.strip():
            os.remove(file_path)  # Clean up
            return jsonify({'error': 'Could not extract text from document'}), 400
        
        # Create document record
        document = Document(
            user_id=user_id,
            filename=filename,
            file_path=file_path,
            content=content,
            file_size=file_size
        )
        
        # Process document into chunks
        chunks = DocumentProcessor.chunk_text(content)
        document.add_chunks(chunks)
        
        # Save to database
        document.save()
        
        return jsonify({
            'message': 'Document uploaded successfully',
            'document': {
                'document_id': document.document_id,
                'filename': document.filename,
                'file_size': document.file_size,
                'uploaded_at': document.uploaded_at.isoformat(),
                'chunks_count': len(chunks)
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Upload failed', 'details': str(e)}), 500

@documents_bp.route('/list', methods=['GET'])
@jwt_required()
def list_documents():
    try:
        user_id = get_jwt_identity()
        documents = Document.find_by_user(user_id)
        
        doc_list = []
        for doc in documents:
            doc_list.append({
                'document_id': doc['document_id'],
                'filename': doc['filename'],
                'file_size': doc['file_size'],
                'uploaded_at': doc['uploaded_at'].isoformat(),
                'processed': doc['processed'],
                'chunks_count': len(doc.get('chunks', []))
            })
        
        return jsonify({
            'documents': doc_list,
            'total': len(doc_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to list documents', 'details': str(e)}), 500

@documents_bp.route('/<document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    try:
        user_id = get_jwt_identity()
        document = Document.find_by_id(document_id)
        
        if not document or document.user_id != user_id:
            return jsonify({'error': 'Document not found'}), 404
        
        return jsonify({
            'document': {
                'document_id': document.document_id,
                'filename': document.filename,
                'file_size': document.file_size,
                'uploaded_at': document.uploaded_at.isoformat(),
                'processed': document.processed,
                'content_preview': document.content[:500] + '...' if len(document.content) > 500 else document.content,
                'chunks_count': len(document.chunks)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get document', 'details': str(e)}), 500

@documents_bp.route('/<document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    try:
        user_id = get_jwt_identity()
        document = Document.find_by_id(document_id)
        
        if not document or document.user_id != user_id:
            return jsonify({'error': 'Document not found'}), 404
        
        # Delete file from filesystem
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        # Delete from database
        Document.delete_by_id(document_id)
        
        return jsonify({'message': 'Document deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to delete document', 'details': str(e)}), 500