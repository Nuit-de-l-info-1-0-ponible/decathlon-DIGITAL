from app.models.profile import UserProfile, Product, RecommendationResponse
import sys
import os
import random

# Add project root to path to import ml modules
# In Docker, /app is root, so ml is at /app/ml. 
# But we need to make sure python path finds it.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from ml.embedding import TextEmbedder
from ml.search import VectorSearch

class RecommendationService:
    def __init__(self):
        print("Initializing Recommendation Service...")
        try:
            self.embedder = TextEmbedder()
            # Resolve absolute path to data/faiss_index.bin
            # Hardcoding for stability in this environment
            index_path = "/Users/mohamedchadrak/Downloads/nuit_informatique/DECATHLON/data/faiss_index.bin"
            
            self.embedder = TextEmbedder()
            self.searcher = VectorSearch(index_path=index_path)
            if not self.searcher.load_index():
                print("Warning: FAISS index not found. Recommendations will be empty.")
        except Exception as e:
            print(f"Error initializing ML modules: {e}")
            self.embedder = None
            self.searcher = None

    def fetch_external_advice(self, profile: UserProfile) -> str:
        """
        Simulate fetching advice from the web based on profile keywords.
        """
        advice_db = {
            "back_pain": [
                "Selon la Clinique Mayo, des activités aérobiques régulières à faible impact peuvent augmenter la force et l'endurance de votre dos et permettre à vos muscles de mieux fonctionner.",
                "WebMD suggère : 'Ne vous arrêtez pas de bouger. L'activité physique peut aider à soulager l'inflammation et la tension musculaire.'",
                "Healthline recommande le yoga et la natation comme d'excellents exercices à faible impact pour soulager le mal de dos."
            ],
            "posture": [
                "Harvard Health déclare : 'Une bonne posture vous aide à vous tenir debout, marcher, s'asseoir et s'allonger dans des positions qui exercent le moins de tension sur les muscles et les ligaments de soutien.'",
                "Conseils d'experts en ergonomie : Gardez votre écran au niveau des yeux et les pieds à plat sur le sol."
            ],
            "running": [
                "Conseil de Runner's World : 'Augmentez votre kilométrage de pas plus de 10% par semaine pour éviter les blessures.'",
                "Conseil Asics : 'La bonne chaussure dépend de votre type de pronation. Faites une analyse de foulée.'"
            ],
            "beginner": [
                "Conseil général de fitness : 'La régularité est la clé. Commencez petit et construisez une habitude.'",
                "Le CDC recommande au moins 150 minutes d'activité d'intensité modérée par semaine."
            ]
        }
        
        external_tips = []
        if profile.back_pain and profile.back_pain != "None":
            external_tips.append(random.choice(advice_db["back_pain"]))
        if profile.posture_rating and int(profile.posture_rating) < 3:
            external_tips.append(random.choice(advice_db["posture"]))
        if profile.sport == "Running":
            external_tips.append(random.choice(advice_db["running"]))
        if profile.level == "Beginner":
            external_tips.append(random.choice(advice_db["beginner"]))
            
        if not external_tips:
            return "N'oubliez pas de rester hydraté et d'écouter votre corps !"
            
        return " ".join(external_tips)

    def generate_advice(self, profile: UserProfile) -> str:
        advice = f"Basé sur votre objectif de {', '.join(profile.goals)} et votre niveau {profile.level} en {profile.sport}, nous vous recommandons de vous concentrer sur la régularité."
        if "Lose weight" in profile.goals:
            advice += " Combinez le cardio avec un entraînement léger en résistance."
        if "Build muscle" in profile.goals:
            advice += " Assurez-vous de consommer suffisamment de protéines et d'augmenter progressivement la charge."
        
        # Health & Posture specific advice
        if profile.back_pain and profile.back_pain != "None":
            advice += " Puisque vous avez mal au dos, privilégiez les exercices à faible impact et une bonne forme. Envisagez de consulter un spécialiste."
        if profile.posture_rating and int(profile.posture_rating) < 3:
            advice += " Votre note de posture suggère que vous pourriez bénéficier d'exercices de renforcement du tronc et de flexibilité."
        if profile.sedentary_level == "High":
            advice += " Essayez d'incorporer plus de mouvement tout au long de votre journée pour combattre les habitudes sédentaires."
            
        return advice

    def get_recommendations(self, profile: UserProfile) -> RecommendationResponse:
        internal_advice = self.generate_advice(profile)
        external_advice = self.fetch_external_advice(profile)
        products = []
        
        if self.embedder and self.searcher and self.searcher.index is not None:
            try:
                # Enrich query with health context
                health_context = ""
                if profile.back_pain:
                    health_context += f" back pain {profile.back_pain}"
                if profile.medical_conditions:
                    health_context += f" condition {profile.medical_conditions}"
                
                query = f"{profile.sport} {profile.level} {' '.join(profile.goals)} {profile.budget} {health_context}"
                print(f"Searching for: {query}")
                vector = self.embedder.embed(query)
                results = self.searcher.search(vector, k=5)
                
                for res in results:
                    item = res['item']
                    products.append(Product(
                        id=item['id'],
                        name=item['name'],
                        description=item['description'],
                        price=item['price'],
                        image_url=item['image_url'],
                        url=item['url'],
                        score=res['score']
                    ))
            except Exception as e:
                print(f"Error during search: {e}")
        else:
            print("ML modules not ready, returning empty list.")
        
        return RecommendationResponse(advice=internal_advice, external_advice=external_advice, products=products)

recommendation_service = RecommendationService()
