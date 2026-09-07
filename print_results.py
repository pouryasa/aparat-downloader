import json

with open("playlist_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total episodes: {len(data)}")
for i, item in enumerate(data, 1):
    link = item["link_720p"] or item["selected_link"]
    title = item["title"]
    print(f"Episode {i}: {title}\nLink: {link}\n")
