import urllib.request
import json

playlist_id = "21933286"
url = f"https://www.aparat.com/api/fa/v1/video/playlist/one/playlist_id/{playlist_id}"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))

print("Top level keys:", list(data.keys()))
if "included" in data:
    types = set(item.get("type") for item in data["included"])
    print("Types in included:", types)
    for item in data["included"]:
        if item.get("type") in ["video", "Video"]:
            print(item)
        elif "attributes" in item and "title" in item["attributes"]:
            print("Found item with title:", item.get("type"), item["attributes"].get("title"), item["attributes"].get("uid"))
