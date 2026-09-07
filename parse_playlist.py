import urllib.request
import json
import time

playlist_id = "21933286"
url = f"https://www.aparat.com/api/fa/v1/video/playlist/one/playlist_id/{playlist_id}"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))

included = data.get("included", [])
videos = []
for item in included:
    if item.get("type") == "video":
        attrs = item.get("attributes", {})
        videos.append({
            "uid": attrs.get("uid"),
            "title": attrs.get("title")
        })

print(f"Total videos in playlist API response: {len(videos)}")
for i, v in enumerate(videos, 1):
    print(f"{i}. {v['uid']} - {v['title']}")
