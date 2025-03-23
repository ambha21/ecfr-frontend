from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import json
from dotenv import load_dotenv
from collections import Counter
from datetime import datetime
import time

load_dotenv()
BASE_URL = "https://www.ecfr.gov"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define cache file and TTL (e.g., 1 hour)
CACHE_FILENAME = "regulation_churn_cache.json"
CACHE_TTL = 3600  # seconds

def load_cache():
    if os.path.exists(CACHE_FILENAME):
        last_modified = os.path.getmtime(CACHE_FILENAME)
        if time.time() - last_modified < CACHE_TTL:
            with open(CACHE_FILENAME, "r") as f:
                return json.load(f)
    return None

def save_cache(data):
    with open(CACHE_FILENAME, "w") as f:
        json.dump(data, f)

@app.get("/ping")
def ping():
    return {"message": "pong!"}

@app.get("/titles")
def get_titles():
    response = requests.get(f"{BASE_URL}/api/versioner/v1/titles.json")
    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to fetch titles"}

@app.get("/words_by_title")
def words_by_title():
    response = requests.get(f"{BASE_URL}/api/versioner/v1/titles.json")
    if response.status_code != 200:
        return {"error": "Failed to fetch titles"}
    titles = response.json().get("titles", [])
    augmented_titles = []
    
    for title in titles:
        issue_date = title.get("latest_issue_date")
        if issue_date:
            try:
                xml_url = f"{BASE_URL}/api/versioner/v1/full/{issue_date}/title-{title['number']}.xml"
                xml_resp = requests.get(xml_url)
                if xml_resp.status_code == 200:
                    import xml.etree.ElementTree as ET
                    root = ET.fromstring(xml_resp.text)
                    text_content = " ".join(
                        [p.text.strip() for p in root.findall(".//P") if p.text]
                    )
                    word_count = len(text_content.split())
                    title["word_count"] = word_count
                    print(f"Title {title['number']} word count: {word_count}")
                else:
                    title["word_count"] = 0
                    print(f"Failed to fetch XML for Title {title['number']}")
            except Exception as e:
                title["word_count"] = 0
                print(f"Error computing word count for Title {title['number']}: {e}")
        else:
            title["word_count"] = 0
        augmented_titles.append(title)
    print("Returning augmented titles:", augmented_titles)
    return augmented_titles

@app.get("/regulation_churn")
def regulation_churn():
    # Try to load cached data
    cached = load_cache()
    if cached is not None:
        return cached

    print("Fetching titles for regulation churn...")
    response = requests.get(f"{BASE_URL}/api/versioner/v1/titles.json")
    if response.status_code != 200:
        return {"error": "Failed to fetch titles"}
    titles = response.json().get("titles", [])
    
    title_revisions = []
    
    for t in titles:
        amendments_response = requests.get(f"{BASE_URL}/api/versioner/v1/versions/title-{t['number']}.json")
        if amendments_response.status_code == 200:
            amendments = amendments_response.json().get("content_versions", [])
        else:
            amendments = []
        
        try:
            changes_per_year = {
                str(year): count
                for year, count in Counter(
                    datetime.strptime(a["amendment_date"], "%Y-%m-%d").year
                    for a in amendments if a.get("amendment_date")
                ).items()
            }
        except Exception as e:
            changes_per_year = {}
            print(f"Error processing title {t['number']}: {e}")
        
        title_revisions.append({
            "title_number": t["number"],
            "title_name": t.get("name", ""),
            "changes_per_year": changes_per_year
        })
    
    # Save to cache file for future requests
    save_cache(title_revisions)
    return title_revisions

@app.get("/common_words_by_title")
def common_words_by_title(title: int):
    cache_key = f"common_words_by_title_{title}"
    # For simplicity, no file caching here, but you can add it similarly.
    response = requests.get(f"{BASE_URL}/api/versioner/v1/full/2023-01-01/title-{title}.xml")
    if response.status_code != 200:
        return {"error": "Failed to fetch title XML"}
    
    import xml.etree.ElementTree as ET, re, random
    from collections import Counter
    root = ET.fromstring(response.text)
    text_content = " ".join(p.text.strip() for p in root.findall(".//P") if p.text)
    words = re.findall(r"\b\w+\b", text_content.lower())
    banned_words = {"the", "of", "to", "a", "or", "and", "in", "for", "that", "be", "by", "is", "with"}
    filtered_words = [word for word in words if word not in banned_words]
    if len(filtered_words) > 250000:
        filtered_words = random.sample(filtered_words, 250000)
    word_counts = Counter(filtered_words)
    return word_counts.most_common(50)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
