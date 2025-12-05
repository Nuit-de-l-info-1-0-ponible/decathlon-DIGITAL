import json
import os
import sys
import numpy as np

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ml.embedding import TextEmbedder
from ml.search import VectorSearch

DATA_FILE = "data/products.json"
INDEX_PATH = "data/faiss_index.bin"

def index_products():
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
    except ImportError:
        print("Error: psycopg2 not found. Please install it with 'pip install psycopg2-binary'")
        return

    DB_CONFIG = {
        "host": "10.8.0.1",
        "port": "5432",
        "user": "mohamed",
        "password": "Azertyuiop@2025",
        "dbname": "nuit_info_deca"
    }

    print(f"Connecting to database {DB_CONFIG['host']}...")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print("Fetching products from database...")
        cur.execute("SELECT * FROM products")
        products = cur.fetchall()
        
        cur.close()
        conn.close()
        print(f"Loaded {len(products)} products from DB.")
        
    except Exception as e:
        print(f"Database error: {e}")
        # Fallback to JSON if DB fails
        if os.path.exists(DATA_FILE):
            print(f"Falling back to {DATA_FILE}...")
            with open(DATA_FILE, "r") as f:
                products = json.load(f)
        else:
            print("No data found.")
            return

    embedder = TextEmbedder()
    searcher = VectorSearch(index_path=INDEX_PATH)

    texts = []
    metadata = []
    
    print("Generating embeddings...")
    for p in products:
        # Create a rich text representation for embedding
        text = f"{p['name']} {p['description']} {p['sport']} {p['level']} {p['category']}"
        texts.append(text)
        metadata.append(p)

    embeddings = embedder.embed_batch(texts)
    
    # Ensure embeddings are numpy array of float32
    embeddings = np.array(embeddings).astype('float32')

    print("Building index...")
    searcher.build_index(embeddings, metadata)
    print("Done!")

if __name__ == "__main__":
    index_products()
