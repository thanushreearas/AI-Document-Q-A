from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.database import db
from routes.auth import auth_bp
from routes.documents import documents_bp
from routes.qa import qa_bp
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    jwt = JWTManager(app)
    
    # Create upload directory
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Database is already initialized in models/database.py
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(qa_bp, url_prefix='/api/qa')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token required'}), 401
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'AI Document Q&A System is running',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'AI Document Q&A System API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'documents': '/api/documents',
                'qa': '/api/qa',
                'health': '/api/health'
            }
        }), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    if app:
        print("Starting AI Document Q&A System...")
        print("API Documentation:")
        print("- POST /api/auth/register - Register new user")
        print("- POST /api/auth/login - Login user")
        print("- GET /api/auth/profile - Get user profile")
        print("- POST /api/documents/upload - Upload document")
        print("- GET /api/documents/list - List user documents")
        print("- GET /api/documents/<id> - Get document details")
        print("- DELETE /api/documents/<id> - Delete document")
        print("- POST /api/qa/ask - Ask question about document")
        print("- POST /api/qa/summarize/<id> - Generate document summary")
        print("- GET /api/qa/history - Get Q&A history")
        print("- DELETE /api/qa/history/<id> - Delete Q&A record")
        print("\nServer running on http://localhost:5000")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("Failed to create application!")