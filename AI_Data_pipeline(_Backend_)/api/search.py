import requests
SERP_API_KEY="your_serp_api_key_here"
def search(query):
    url = f"https://serpapi.com/search.json?q={query}&api_key={SERP_API_KEY}"
    params = {
        "q": query,
        "api_key": SERP_API_KEY  
        } 
    response = requests.get(url, params=params)
    data = response.json()
    results = data.get("organic_results", [])
    for result in results:
        title = result.get("title")
        link = result.get("link")
        snippet = result.get("snippet")
        print(f"Title: {title}\nLink: {link}\nSnippet: {snippet}\n")
if __name__ == "__main__":
    query = "What is the capital of France?"
    search(query) 
    print("Search completed successfully.")
