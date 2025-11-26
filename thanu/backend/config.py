import os

class Config:
    # SQLite Configuration
    DATABASE_PATH = "document_qa.db"
    
    # OpenRouter API Configuration
    OPENROUTER_API_KEY = "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"
    OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
    MODEL_NAME = "gpt-oss-20b"
    
    # JWT Configuration
    JWT_SECRET_KEY = "your-secret-key-change-in-production"
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 1024 * 1024 * 1024  # 1GB
    UPLOAD_FOLDER = "uploads"
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}
    
    # App Configuration
    SECRET_KEY = "your-flask-secret-key"
    DEBUG = True