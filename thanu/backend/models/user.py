from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from .database import Database
import uuid

class User:
    def __init__(self, username, email, password=None, user_id=None):
        self.user_id = user_id or str(uuid.uuid4())
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password) if password else None
        self.created_at = datetime.utcnow()
        self.is_active = True
    
    def save(self):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (user_id, username, email, password_hash, created_at, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (self.user_id, self.username, self.email, self.password_hash, self.created_at, self.is_active))
        
        conn.commit()
        conn.close()
        return self.user_id
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def find_by_email(email):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            user = User(
                username=row['username'],
                email=row['email'],
                user_id=row['user_id']
            )
            user.password_hash = row['password_hash']
            user.created_at = datetime.fromisoformat(row['created_at'])
            user.is_active = bool(row['is_active'])
            return user
        return None
    
    @staticmethod
    def find_by_id(user_id):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            user = User(
                username=row['username'],
                email=row['email'],
                user_id=row['user_id']
            )
            user.password_hash = row['password_hash']
            user.created_at = datetime.fromisoformat(row['created_at'])
            user.is_active = bool(row['is_active'])
            return user
        return None