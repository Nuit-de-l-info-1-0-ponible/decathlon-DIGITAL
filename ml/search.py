try:
    import numpy as np
    import pickle
    import os
except ImportError:
    print("Error: numpy, pickle, or os not found.")
    np = None
    pickle = None
    os = None

try:
    import faiss
except ImportError:
    print("Warning: faiss not found. Using Numpy fallback.")
    faiss = None

class VectorSearch:
    def __init__(self, index_path="data/faiss_index.bin", dimension=384):
        self.index_path = index_path
        self.dimension = dimension
        self.index = None
        self.metadata = [] # List to store product metadata corresponding to index IDs

    def build_index(self, embeddings, metadata: list):
        """
        Build a new index. Uses FAISS if available, otherwise stores embeddings as Numpy array.
        """
        if faiss:
            print(f"Building FAISS index with {len(embeddings)} items...")
            self.index = faiss.IndexFlatIP(self.dimension)
            faiss.normalize_L2(embeddings)
            self.index.add(embeddings)
        else:
            print(f"Building Numpy index (fallback) with {len(embeddings)} items...")
            # Normalize for cosine similarity
            norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
            self.index = embeddings / norms
            
        self.metadata = metadata
        self.save_index()

    def save_index(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        with open(self.index_path + ".meta", "wb") as f:
            pickle.dump(self.metadata, f)
            
        if faiss and hasattr(self.index, 'add'): # Check if it's a FAISS index
            faiss.write_index(self.index, self.index_path)
            print(f"FAISS index saved to {self.index_path}")
        else:
            # Save numpy array
            np.save(self.index_path + ".npy", self.index)
            print(f"Numpy index saved to {self.index_path}.npy")

    def load_index(self):
        if not os.path.exists(self.index_path + ".meta"):
            print("Index metadata not found.")
            return False
            
        with open(self.index_path + ".meta", "rb") as f:
            self.metadata = pickle.load(f)

        # Try loading FAISS index
        if faiss and os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            print(f"FAISS index loaded from {self.index_path}")
            return True
        
        # Try loading Numpy index
        if os.path.exists(self.index_path + ".npy"):
            print(f"Loading Numpy index from {self.index_path}.npy")
            self.index = np.load(self.index_path + ".npy")
            return True
            
        print("No index file found.")
        return False

    def search(self, query_vector, k=5):
        """
        Search for top k similar items.
        """
        if self.index is None:
            print("Index is empty.")
            return []
        
        # FAISS Search
        if faiss and hasattr(self.index, 'search'):
            faiss.normalize_L2(query_vector.reshape(1, -1))
            distances, indices = self.index.search(query_vector.reshape(1, -1), k)
            results = []
            for i, idx in enumerate(indices[0]):
                if idx != -1 and idx < len(self.metadata):
                    results.append({
                        "item": self.metadata[idx],
                        "score": float(distances[0][i])
                    })
            return results
            
        # Numpy Search (Fallback)
        else:
            # Normalize query
            norm = np.linalg.norm(query_vector)
            if norm > 0:
                query_vector = query_vector / norm
            
            # Cosine similarity: dot product of normalized vectors
            # self.index is (N, D), query is (D,)
            scores = np.dot(self.index, query_vector)
            
            # Get top k indices
            top_k_indices = np.argsort(scores)[::-1][:k]
            
            results = []
            for idx in top_k_indices:
                if idx < len(self.metadata):
                    results.append({
                        "item": self.metadata[idx],
                        "score": float(scores[idx])
                    })
            return results
