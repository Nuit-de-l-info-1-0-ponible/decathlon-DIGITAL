try:
    import numpy as np
except ImportError:
    print("Error: numpy not found.")
    np = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Warning: sentence_transformers not found. Using mock TextEmbedder.")
    SentenceTransformer = None

class TextEmbedder:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        if SentenceTransformer:
            print(f"Loading model {model_name}...")
            self.model = SentenceTransformer(model_name)
        else:
            self.model = None

    def embed(self, text: str):
        """
        Generate embedding for a single text string using Hashing Bag-of-Words.
        This creates a deterministic vector based on word presence.
        """
        if self.model:
            return self.model.encode(text)
        
        # Smart Light ML: Hashing Vectorizer
        # Dimension 384 to match standard models
        vector = np.zeros(384, dtype='float32')
        if np:
            words = text.lower().split()
            for word in words:
                # Simple tokenization and hashing
                # Use a consistent hash seed or just python's hash if stable enough for this session
                # Python's hash is randomized per session, which is fine for a running server
                # but might be an issue if index is built in one process and loaded in another?
                # Yes, Python hash randomization is enabled by default.
                # We should use a stable hash. md5 or similar.
                # Or just use a simple custom hash for this demo.
                
                # Simple stable hash function for demo
                h = 0
                for char in word:
                    h = (h * 31 + ord(char)) % 384
                vector[h] += 1.0
            
            # Normalize
            norm = np.linalg.norm(vector)
            if norm > 0:
                vector = vector / norm
                
            return vector
        return [0.0] * 384

    def embed_batch(self, texts: list[str]):
        """
        Generate embeddings for a list of texts.
        """
        if self.model:
            return self.model.encode(texts)
            
        if np:
            embeddings = []
            for text in texts:
                embeddings.append(self.embed(text))
            return np.array(embeddings)
        return [[0.0] * 384 for _ in texts]
