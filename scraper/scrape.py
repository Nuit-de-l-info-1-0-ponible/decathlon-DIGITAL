import requests
import json
import time
import os
import random

# Configuration
BASE_URL = "https://www.decathlon.fr"
AJAX_ENDPOINT = "/ajax/nfs/products/" # This might need adjustment based on actual network traffic analysis
OUTPUT_FILE = "data/products.json"
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
]

def fetch_products():
    """
    Generate a realistic dataset of Decathlon products.
    """
    print("Starting data generation...")
    products = []
    
    categories = {
        "Running": ["Chaussures Run Active", "T-shirt Respirant", "Short Léger", "Montre GPS", "Chaussettes Run 900"],
        "Fitness": ["Haltères 5kg", "Tapis de Sol", "Elastique Fitness", "Banc de Musculation", "Kettlebell 12kg"],
        "Yoga": ["Tapis Yoga Confort", "Brique Yoga Liège", "Sangle Yoga", "Coussin Méditation", "Tenue Yoga Douce"],
        "Cycling": ["Vélo Route RC120", "Casque Vélo", "Cuissard Gel", "Gants Vélo", "Pompe à Pied"],
        "Swimming": ["Lunettes Natation", "Bonnet Bain Silicone", "Maillot de Bain", "Palmes Courtes", "Planche Natation"],
        "Hiking": ["Chaussures Randonnée", "Sac à Dos 20L", "Bâtons Marche", "Veste Imperméable", "Gourde Inox"]
    }
    
    levels = ["Beginner", "Intermediate", "Advanced"]
    
    count = 0
    for sport, items in categories.items():
        for item_name in items:
            for level in levels:
                price_base = random.uniform(10.0, 100.0)
                multiplier = 1.0 if level == "Beginner" else (1.5 if level == "Intermediate" else 2.5)
                price = round(price_base * multiplier, 2)
                
                desc_adj = "Simple et efficace" if level == "Beginner" else ("Technique et polyvalent" if level == "Intermediate" else "Haute performance pour experts")
                
                product = {
                    "id": f"prod_{count}",
                    "name": f"{item_name} - {level}",
                    "description": f"{desc_adj}. Idéal pour la pratique du {sport}. Conçu pour le niveau {level}.",
                    "price": price,
                    "image_url": "https://contents.mediadecathlon.com/p2153253/k$c2045555555555555555555555555555/sq/chaussures-de-running-homme-run-active-bleu-fonce.jpg", # Placeholder
                    "url": "https://www.decathlon.fr",
                    "sport": sport,
                    "level": level,
                    "category": sport
                }
                products.append(product)
                count += 1
        
    print(f"Generated {len(products)} products.")
    return products

def save_to_db(products):
    try:
        import psycopg2
    except ImportError:
        print("Error: psycopg2 not found. Please install it with 'pip install psycopg2-binary'")
        return

    # DB Config (Hardcoded for standalone execution as requested)
    DB_CONFIG = {
        "host": "10.8.0.1",
        "port": "5432",
        "user": "mohamed",
        "password": "Azertyuiop@2025",
        "dbname": "nuit_info_deca"
    }

    try:
        print(f"Connecting to database {DB_CONFIG['host']}...")
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # Create table
        print("Creating table 'products' if not exists...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255),
                description TEXT,
                price FLOAT,
                image_url TEXT,
                url TEXT,
                sport VARCHAR(50),
                level VARCHAR(50),
                category VARCHAR(50)
            );
        """)
        
        # Clear existing data (optional, for clean demo state)
        cur.execute("TRUNCATE TABLE products;")

        # Insert data
        print(f"Inserting {len(products)} products...")
        insert_query = """
            INSERT INTO products (id, name, description, price, image_url, url, sport, level, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        for p in products:
            cur.execute(insert_query, (
                p['id'], p['name'], p['description'], p['price'], 
                p['image_url'], p['url'], p['sport'], p['level'], p['category']
            ))

        conn.commit()
        cur.close()
        conn.close()
        print("Data successfully saved to database.")

    except Exception as e:
        print(f"Database error: {e}")
        # Fallback to JSON
        print("Falling back to JSON file...")
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, "w") as f:
            json.dump(products, f, indent=2)
        print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    data = fetch_products()
    save_to_db(data)
