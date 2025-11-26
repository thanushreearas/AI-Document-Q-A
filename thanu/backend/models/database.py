import sqlite3
import json
from config import Config
import threading

class Database:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.db_path = Config.DATABASE_PATH
            self.init_database()
            self.initialized = True
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        # Documents table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                document_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                content TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                processed BOOLEAN DEFAULT 1,
                chunks TEXT,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Q&A History table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS qa_history (
                qa_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                document_id TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                success BOOLEAN DEFAULT 1,
                context_used INTEGER DEFAULT 0,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id),
                FOREIGN KEY (document_id) REFERENCES documents (document_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("SQLite database initialized successfully!")

# Initialize database instance
db = Database()