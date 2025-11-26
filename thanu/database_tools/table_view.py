import sqlite3
import json

def print_table(cursor, table_name, headers, rows):
    print(f"\n{table_name.upper()} TABLE")
    print("=" * 80)
    
    if not rows:
        print("No data found.")
        return
    
    # Calculate column widths
    widths = [len(h) for h in headers]
    for row in rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(str(cell)))
    
    # Print header
    header_line = " | ".join(h.ljust(w) for h, w in zip(headers, widths))
    print(header_line)
    print("-" * len(header_line))
    
    # Print rows
    for row in rows:
        row_line = " | ".join(str(cell).ljust(w) for cell, w in zip(row, widths))
        print(row_line)

def view_tables():
    db_path = '../backend/document_qa.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("SELECT user_id, username, email, created_at, is_active FROM users")
    users = cursor.fetchall()
    print_table(cursor, "users", ["User ID", "Username", "Email", "Created", "Active"], users)
    
    # Documents table
    cursor.execute("SELECT document_id, user_id, filename, file_size, uploaded_at, processed FROM documents")
    docs = cursor.fetchall()
    print_table(cursor, "documents", ["Doc ID", "User ID", "Filename", "Size", "Uploaded", "Processed"], docs)
    
    # Q&A History table
    cursor.execute("SELECT qa_id, user_id, document_id, question, SUBSTR(answer, 1, 50) as answer, timestamp FROM qa_history")
    qa = cursor.fetchall()
    print_table(cursor, "qa_history", ["QA ID", "User ID", "Doc ID", "Question", "Answer (50 chars)", "Timestamp"], qa)
    
    conn.close()

if __name__ == "__main__":
    view_tables()