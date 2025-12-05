import requests
from bs4 import BeautifulSoup
import time
import random

def scrape_decathlon_real():
    # Target a specific category: Running Shoes for Men
    url = "https://www.decathlon.fr/browse/c0-hommes/c1-chaussures/c2-chaussures-running/_/N-1551h0"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.google.com/"
    }

    print(f"Attempting to scrape: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try to find product cards - selectors are tricky and change often
            # We'll look for common structures
            
            # Debug: Print page title
            print(f"Page Title: {soup.title.string.strip() if soup.title else 'No title'}")
            
            # Attempt to find product names (generic approach)
            # Decathlon often uses specific classes like 'vtmn-t-text-lg' or similar
            # Let's try to find anything that looks like a product container
            
            products_found = 0
            
            # This selector is a guess based on common e-commerce structures. 
            # Real Decathlon site is likely React/Next.js and might need Selenium/Playwright if SSR is not full.
            # But let's try standard HTML parsing first.
            
            # Look for elements that might be product names
            potential_names = soup.find_all(['h2', 'h3'], limit=10)
            
            print("\n--- Potential Products Found (First 10) ---")
            for tag in potential_names:
                text = tag.get_text(strip=True)
                if len(text) > 5: # Filter out short labels
                    print(f"- {text}")
                    products_found += 1
            
            if products_found == 0:
                print("\nNo obvious products found. The site might be using client-side rendering (React/Vue) or blocking us.")
                print("Content preview (first 500 chars):")
                print(response.text[:500])
                
        else:
            print("Failed to retrieve page.")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_decathlon_real()
