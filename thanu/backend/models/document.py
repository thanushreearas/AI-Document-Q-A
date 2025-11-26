from datetime import datetime
from .database import Database
import uuid
import json

class Document:
    def __init__(self, user_id, filename, file_path, content, file_size, document_id=None):
        self.document_id = document_id or str(uuid.uuid4())
        self.user_id = user_id
        self.filename = filename
        self.file_path = file_path
        self.content = content
        self.file_size = file_size
        self.uploaded_at = datetime.utcnow()
        self.processed = True
        self.chunks = []
    
    def save(self):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO documents (document_id, user_id, filename, file_path, content, file_size, uploaded_at, processed, chunks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (self.document_id, self.user_id, self.filename, self.file_path, self.content, 
              self.file_size, self.uploaded_at, self.processed, json.dumps(self.chunks)))
        
        conn.commit()
        conn.close()
        return self.document_id
    
    def add_chunks(self, chunks):
        self.chunks = chunks
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('UPDATE documents SET chunks = ? WHERE document_id = ?', 
                      (json.dumps(chunks), self.document_id))
        
        conn.commit()
        conn.close()
    
    @staticmethod
    def find_by_user(user_id):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC', (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        documents = []
        for row in rows:
            doc_dict = {
                'document_id': row['document_id'],
                'user_id': row['user_id'],
                'filename': row['filename'],
                'file_path': row['file_path'],
                'file_size': row['file_size'],
                'uploaded_at': datetime.fromisoformat(row['uploaded_at']),
                'processed': bool(row['processed']),
                'chunks': json.loads(row['chunks']) if row['chunks'] else []
            }
            documents.append(doc_dict)
        
        return documents
    
    @staticmethod
    def find_by_id(document_id):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM documents WHERE document_id = ?', (document_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            doc = Document(
                user_id=row['user_id'],
                filename=row['filename'],
                file_path=row['file_path'],
                content=row['content'],
                file_size=row['file_size'],
                document_id=row['document_id']
            )
            doc.uploaded_at = datetime.fromisoformat(row['uploaded_at'])
            doc.processed = bool(row['processed'])
            doc.chunks = json.loads(row['chunks']) if row['chunks'] else []
            return doc
        return None
    
    @staticmethod
    def delete_by_id(document_id):
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM documents WHERE document_id = ?', (document_id,))
        deleted_count = cursor.rowcount
        
        conn.commit()
        conn.close()
        return deleted_count > 0