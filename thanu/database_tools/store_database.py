import sqlite3
import uuid
from datetime import datetime

def create_store_database():
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS store (
            id TEXT PRIMARY KEY,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            category TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert sample data
    products = [
        ('Laptop', 999.99, 10, 'Electronics'),
        ('Phone', 599.99, 25, 'Electronics'),
        ('Book', 19.99, 100, 'Education'),
        ('Shirt', 29.99, 50, 'Clothing'),
        ('Coffee', 4.99, 200, 'Food')
    ]
    
    for product in products:
        product_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO store (id, product_name, price, quantity, category, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (product_id, product[0], product[1], product[2], product[3], datetime.now()))
    
    conn.commit()
    conn.close()
    print("Store database created with sample data!")

def view_store_data():
    conn = sqlite3.connect('store.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("=" * 60)
    print("STORE DATABASE")
    print("=" * 60)
    
    cursor.execute("SELECT * FROM store ORDER BY category, product_name")
    products = cursor.fetchall()
    
    if products:
        print(f"{'ID':<36} {'Product':<15} {'Price':<8} {'Qty':<5} {'Category':<12} {'Created'}")
        print("-" * 90)
        for product in products:
            print(f"{product['id']:<36} {product['product_name']:<15} ${product['price']:<7.2f} {product['quantity']:<5} {product['category']:<12} {product['created_at']}")
    else:
        print("No products found.")
    
    conn.close()

if __name__ == "__main__":
    create_store_database()
    view_store_data()