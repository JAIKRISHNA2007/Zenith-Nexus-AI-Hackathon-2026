import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
ECOMMERCE_DB_PATH = BASE_DIR / "database" / "ecommerce.db"


def seed_ecommerce_db(db_path: str = str(ECOMMERCE_DB_PATH)) -> str:
    """
    Creates and seeds a realistic e-commerce BI SQLite database
    containing customers, products, orders, order_items, and inventory.
    """
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        country TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        order_date TEXT NOT NULL,
        status TEXT NOT NULL,
        total_amount REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER UNIQUE NOT NULL,
        stock_quantity INTEGER NOT NULL,
        reorder_level INTEGER NOT NULL,
        last_updated TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
    """)

    # Check if already populated
    cursor.execute("SELECT COUNT(*) FROM customers;")
    if cursor.fetchone()[0] == 0:
        # Seed Customers
        customers = [
            ("Alice Smith", "alice@example.com", "USA", "2026-01-10"),
            ("Bob Jones", "bob@example.com", "Canada", "2026-01-12"),
            ("Charlie Brown", "charlie@example.com", "UK", "2026-01-15"),
            ("Diana Prince", "diana@example.com", "USA", "2026-01-20"),
            ("Evan Wright", "evan@example.com", "Germany", "2026-01-25"),
            ("Fiona Gallagher", "fiona@example.com", "USA", "2026-02-01"),
            ("George Clark", "george@example.com", "Australia", "2026-02-05"),
            ("Hannah Abbott", "hannah@example.com", "USA", "2026-02-10"),
            ("Ian Malcolm", "ian@example.com", "UK", "2026-02-14"),
            ("Julia Roberts", "julia@example.com", "USA", "2026-02-20"),
        ]
        cursor.executemany(
            "INSERT INTO customers (name, email, country, created_at) VALUES (?, ?, ?, ?)",
            customers
        )

        # Seed Products
        products = [
            ("Zenith Pro Laptop", "Electronics", 1299.99, "2026-01-01"),
            ("Nexus Noise-Canceling Headphones", "Electronics", 249.99, "2026-01-01"),
            ("UltraHD Smart Monitor 27''", "Electronics", 399.99, "2026-01-01"),
            ("Ergonomic Wireless Mouse", "Electronics", 49.99, "2026-01-01"),
            ("Mechanical RGB Keyboard", "Electronics", 119.99, "2026-01-01"),
            ("Executive Leather Chair", "Furniture", 299.99, "2026-01-01"),
            ("Standing Height Desk", "Furniture", 499.99, "2026-01-01"),
            ("LED Desk Lamp", "Furniture", 39.99, "2026-01-01"),
            ("Stainless Steel Water Bottle", "Apparel", 24.99, "2026-01-01"),
            ("Developer Tech Hoodie", "Apparel", 69.99, "2026-01-01"),
            ("Smartwatch Series X", "Electronics", 199.99, "2026-01-01"),
            ("USB-C Docking Station", "Electronics", 149.99, "2026-01-01"),
        ]
        cursor.executemany(
            "INSERT INTO products (name, category, price, created_at) VALUES (?, ?, ?, ?)",
            products
        )

        # Seed Orders
        orders = [
            (1, "2026-01-15", "Completed", 1549.98),
            (2, "2026-01-18", "Completed", 299.99),
            (3, "2026-01-22", "Completed", 519.98),
            (4, "2026-01-28", "Completed", 1349.98),
            (5, "2026-02-02", "Completed", 799.98),
            (6, "2026-02-05", "Completed", 249.99),
            (7, "2026-02-10", "Completed", 449.98),
            (8, "2026-02-14", "Completed", 1449.98),
            (9, "2026-02-18", "Completed", 94.98),
            (10, "2026-02-22", "Completed", 1699.98),
            (1, "2026-03-01", "Completed", 249.99),
            (2, "2026-03-05", "Completed", 399.99),
            (4, "2026-03-10", "Pending", 1299.99),
            (5, "2026-03-12", "Completed", 119.99),
            (8, "2026-03-15", "Completed", 549.98),
        ]
        cursor.executemany(
            "INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES (?, ?, ?, ?)",
            orders
        )

        # Seed Order Items
        order_items = [
            (1, 1, 1, 1299.99),
            (1, 2, 1, 249.99),
            (2, 6, 1, 299.99),
            (3, 3, 1, 399.99),
            (3, 5, 1, 119.99),
            (4, 1, 1, 1299.99),
            (4, 4, 1, 49.99),
            (5, 7, 1, 499.99),
            (5, 6, 1, 299.99),
            (6, 2, 1, 249.99),
            (7, 3, 1, 399.99),
            (7, 4, 1, 49.99),
            (8, 1, 1, 1299.99),
            (8, 12, 1, 149.99),
            (9, 9, 1, 24.99),
            (9, 10, 1, 69.99),
            (10, 1, 1, 1299.99),
            (10, 3, 1, 399.99),
            (11, 2, 1, 249.99),
            (12, 3, 1, 399.99),
            (13, 1, 1, 1299.99),
            (14, 5, 1, 119.99),
            (15, 7, 1, 499.99),
            (15, 4, 1, 49.99),
        ]
        cursor.executemany(
            "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
            order_items
        )

        # Seed Inventory
        inventory = [
            (1, 15, 10, "2026-03-15"),
            (2, 45, 15, "2026-03-15"),
            (3, 20, 10, "2026-03-15"),
            (4, 80, 20, "2026-03-15"),
            (5, 30, 10, "2026-03-15"),
            (6, 8, 10, "2026-03-15"),   # Low stock!
            (7, 5, 5, "2026-03-15"),    # Low stock!
            (8, 50, 15, "2026-03-15"),
            (9, 120, 25, "2026-03-15"),
            (10, 4, 10, "2026-03-15"),  # Low stock!
            (11, 25, 10, "2026-03-15"),
            (12, 18, 10, "2026-03-15"),
        ]
        cursor.executemany(
            "INSERT INTO inventory (product_id, stock_quantity, reorder_level, last_updated) VALUES (?, ?, ?, ?)",
            inventory
        )

        conn.commit()

    conn.close()
    return db_path
