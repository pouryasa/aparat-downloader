import urllib.request
import json
from concurrent.futures import ThreadPoolExecutor

playlist_id = "21933286"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def get_playlist_videos(playlist_id):
    url = f"https://www.aparat.com/api/fa/v1/video/playlist/one/playlist_id/{playlist_id}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    
    videos = []
    included = data.get("included", [])
    for item in included:
        if item.get("type") == "Video":
            attrs = item.get("attributes", {})
            videos.append({
                "index": attrs.get("index_playlist"),
                "uid": attrs.get("uid"),
                "title": attrs.get("title")
            })
    
    videos.sort(key=lambda x: int(x.get("index") or 0))
    return videos

def process_video(item):
    uid = item["uid"]
    title = item["title"]
    idx = item["index"]
    url = f"https://www.aparat.com/api/fa/v1/video/video/show/videohash/{uid}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        
        attrs = data.get("data", {}).get("attributes", {})
        file_link_all = attrs.get("file_link_all") or []
        
        qualities = {}
        for link_info in file_link_all:
            prof = link_info.get("profile")
            urls = link_info.get("urls", [])
            if urls:
                qualities[prof] = urls[0]
        
        link_720p = qualities.get("720p")
        best_link = link_720p or qualities.get("1080p") or qualities.get("480p") or (list(qualities.values())[0] if qualities else "N/A")
        
        return {
            "index": idx,
            "title": title,
            "uid": uid,
            "link_720p": link_720p,
            "all_qualities": qualities,
            "selected_link": best_link
        }
    except Exception as e:
        print(f"Error fetching {uid}: {e}")
        return {
            "index": idx,
            "title": title,
            "uid": uid,
            "link_720p": None,
            "all_qualities": {},
            "selected_link": "N/A"
        }

playlist_videos = get_playlist_videos(playlist_id)
print(f"Found {len(playlist_videos)} videos in playlist. Fetching details concurrently...")

with ThreadPoolExecutor(max_workers=15) as executor:
    results = list(executor.map(process_video, playlist_videos))

results.sort(key=lambda x: int(x.get("index") or 0))

with open("playlist_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Successfully processed {len(results)} videos!")
