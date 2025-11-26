import sqlite3
import json
import os

def view_database_data():
    db_path = os.path.join('..', 'backend', 'document_qa.db')
    
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        print("=" * 60)
        print("DATABASE CONTENTS")
        print("=" * 60)
        
        # Users table
        print("\nUSERS TABLE:")
        print("-" * 40)
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        
        if users:
            for user in users:
                print(f"User ID: {user['user_id']}")
                print(f"Username: {user['username']}")
                print(f"Email: {user['email']}")
                print(f"Created: {user['created_at']}")
                print(f"Active: {user['is_active']}")
                print("-" * 40)
        else:
            print("No users found.")
        
        # Documents table
        print("\nDOCUMENTS TABLE:")
        print("-" * 40)
        cursor.execute("SELECT * FROM documents")
        documents = cursor.fetchall()
        
        if documents:
            for doc in documents:
                print(f"Document ID: {doc['document_id']}")
                print(f"User ID: {doc['user_id']}")
                print(f"Filename: {doc['filename']}")
                print(f"File Size: {doc['file_size']} bytes")
                print(f"Uploaded: {doc['uploaded_at']}")
                print(f"Processed: {doc['processed']}")
                print(f"Content Preview: {doc['content'][:100]}...")
                chunks = json.loads(doc['chunks']) if doc['chunks'] else []
                print(f"Chunks: {len(chunks)} chunks")
                print("-" * 40)
        else:
            print("No documents found.")
        
        # Q&A History table
        print("\nQ&A HISTORY TABLE:")
        print("-" * 40)
        cursor.execute("SELECT * FROM qa_history")
        qa_records = cursor.fetchall()
        
        if qa_records:
            for qa in qa_records:
                print(f"QA ID: {qa['qa_id']}")
                print(f"User ID: {qa['user_id']}")
                print(f"Document ID: {qa['document_id']}")
                print(f"Question: {qa['question']}")
                print(f"Answer: {qa['answer'][:100]}...")
                print(f"Success: {qa['success']}")
                print(f"Timestamp: {qa['timestamp']}")
                print("-" * 40)
        else:
            print("No Q&A history found.")
        
        # Summary
        print(f"\nSUMMARY:")
        print(f"Total Users: {len(users)}")
        print(f"Total Documents: {len(documents)}")
        print(f"Total Q&A Records: {len(qa_records)}")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    view_database_data()