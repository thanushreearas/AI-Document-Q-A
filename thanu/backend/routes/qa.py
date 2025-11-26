from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.document import Document
from models.database import Database
from utils.ai_service import AIService
from datetime import datetime
import uuid

qa_bp = Blueprint('qa', __name__)

@qa_bp.route('/ask', methods=['POST'])
@jwt_required()
def ask_question():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'question' not in data or 'document_id' not in data:
            return jsonify({'error': 'Missing question or document_id'}), 400
        
        question = data['question'].strip()
        document_id = data['document_id']
        
        if not question:
            return jsonify({'error': 'Question cannot be empty'}), 400
        
        # Get document
        document = Document.find_by_id(document_id)
        if not document or document.user_id != user_id:
            return jsonify({'error': 'Document not found'}), 404
        
        # Initialize AI service
        ai_service = AIService()
        
        # Get answer from AI
        result = ai_service.answer_question(
            question=question,
            document_chunks=document.chunks,
            document_title=document.filename
        )
        
        # Save Q&A to history
        qa_id = str(uuid.uuid4())
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO qa_history (qa_id, user_id, document_id, question, answer, success, context_used, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (qa_id, user_id, document_id, question, result['answer'], result['success'], 
              result.get('context_used', 0), datetime.utcnow()))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'question': question,
            'answer': result['answer'],
            'success': result['success'],
            'context_used': result.get('context_used', 0),
            'document_title': document.filename,
            'qa_id': qa_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to process question', 'details': str(e)}), 500

@qa_bp.route('/summarize/<document_id>', methods=['POST'])
@jwt_required()
def summarize_document(document_id):
    try:
        user_id = get_jwt_identity()
        
        # Get document
        document = Document.find_by_id(document_id)
        if not document or document.user_id != user_id:
            return jsonify({'error': 'Document not found'}), 404
        
        # Initialize AI service
        ai_service = AIService()
        
        # Generate summary
        result = ai_service.summarize_document(
            document_chunks=document.chunks,
            document_title=document.filename
        )
        
        return jsonify({
            'document_title': document.filename,
            'summary': result['summary'],
            'success': result['success']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to generate summary', 'details': str(e)}), 500

@qa_bp.route('/history', methods=['GET'])
@jwt_required()
def get_qa_history():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        document_id = request.args.get('document_id')
        limit = int(request.args.get('limit', 50))
        
        # Get history
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        if document_id:
            cursor.execute('''
                SELECT * FROM qa_history 
                WHERE user_id = ? AND document_id = ? 
                ORDER BY timestamp DESC LIMIT ?
            ''', (user_id, document_id, limit))
        else:
            cursor.execute('''
                SELECT * FROM qa_history 
                WHERE user_id = ? 
                ORDER BY timestamp DESC LIMIT ?
            ''', (user_id, limit))
        
        rows = cursor.fetchall()
        conn.close()
        
        history_list = []
        for row in rows:
            history_list.append({
                'qa_id': row['qa_id'],
                'document_id': row['document_id'],
                'question': row['question'],
                'answer': row['answer'],
                'success': bool(row['success']),
                'context_used': row['context_used'],
                'timestamp': row['timestamp']
            })
        
        return jsonify({
            'history': history_list,
            'total': len(history_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get history', 'details': str(e)}), 500

@qa_bp.route('/history/<qa_id>', methods=['DELETE'])
@jwt_required()
def delete_qa_record(qa_id):
    try:
        user_id = get_jwt_identity()
        
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM qa_history WHERE qa_id = ? AND user_id = ?', (qa_id, user_id))
        deleted_count = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        if deleted_count == 0:
            return jsonify({'error': 'Q&A record not found'}), 404
        
        return jsonify({'message': 'Q&A record deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to delete record', 'details': str(e)}), 500