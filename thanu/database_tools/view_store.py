import sqlite3

def view_store():
    conn = sqlite3.connect('store.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("STORE INVENTORY")
    print("=" * 50)
    
    cursor.execute("SELECT * FROM store ORDER BY category, product_name")
    products = cursor.fetchall()
    
    for product in products:
        print(f"Product: {product['product_name']}")
        print(f"Price: ${product['price']}")
        print(f"Stock: {product['quantity']}")
        print(f"Category: {product['category']}")
        print("-" * 30)
    
    print(f"Total Products: {len(products)}")
    conn.close()

if __name__ == "__main__":
    view_store()