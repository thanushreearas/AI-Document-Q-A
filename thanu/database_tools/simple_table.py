import sqlite3

def view_data():
    conn = sqlite3.connect('../backend/document_qa.db')
    cursor = conn.cursor()
    
    print("USERS TABLE")
    print("=" * 60)
    cursor.execute("SELECT username, email, created_at FROM users")
    for row in cursor.fetchall():
        print(f"User: {row[0]} | Email: {row[1]} | Created: {row[2]}")
    
    print("\nDOCUMENTS TABLE")
    print("=" * 60)
    cursor.execute("SELECT filename, file_size, uploaded_at FROM documents")
    for row in cursor.fetchall():
        print(f"File: {row[0]} | Size: {row[1]} bytes | Uploaded: {row[2]}")
    
    print("\nQ&A HISTORY TABLE")
    print("=" * 60)
    cursor.execute("SELECT question, timestamp FROM qa_history")
    for row in cursor.fetchall():
        print(f"Q: {row[0]} | Time: {row[1]}")
    
    conn.close()

if __name__ == "__main__":
    view_data()