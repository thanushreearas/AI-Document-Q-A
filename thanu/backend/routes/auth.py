from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({'error': 'Missing required fields'}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password length
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409
        
        # Create new user
        user = User(username=username, email=email, password=password)
        user.save()
        
        # Create access token
        access_token = create_access_token(identity=user.user_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Missing email or password'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user
        user = User.find_by_email(email)
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.user_id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'created_at': user.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500