import requests
import json

url = "http://localhost:8000/api/v1/recommend"

payload = {
    "sport": "Running",
    "frequency": "Weekly",
    "level": "Beginner",
    "goals": ["Health"],
    "constraints": [],
    "budget": "Medium",
    "medical_conditions": "None",
    "posture_rating": 3,
    "back_pain": "Occasional",
    "sedentary_level": "Medium"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
