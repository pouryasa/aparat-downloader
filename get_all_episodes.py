import urllib.request
import json
import time

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
    
    # Sort by playlist index or order if available
    videos.sort(key=lambda x: x.get("index") or 0)
    return videos

def get_video_download_links(uid):
    url = f"https://www.aparat.com/api/fa/v1/video/video/show/videohash/{uid}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        
        attrs = data.get("data", {}).get("attributes", {})
        file_link_all = attrs.get("file_link_all") or []
        
        links_by_quality = {}
        for link_info in file_link_all:
            profile = link_info.get("profile") # e.g., '720p', '480p', etc.
            urls = link_info.get("urls", [])
            if urls:
                links_by_quality[profile] = urls[0]
        
        return links_by_quality
    except Exception as e:
        print(f"Error fetching video {uid}: {e}")
        return {}

playlist_videos = get_playlist_videos(playlist_id)
print(f"Found {len(playlist_videos)} videos in playlist {playlist_id}.\n")

results = []

for idx, v in enumerate(playlist_videos, 1):
    uid = v["uid"]
    title = v["title"]
    qualities = get_video_download_links(uid)
    
    # Get 720p link, fallback to 480p, 1080p, etc. if 720p is absent
    link_720p = qualities.get("720p")
    best_link = link_720p or qualities.get("1080p") or qualities.get("480p") or (list(qualities.values())[0] if qualities else "N/A")
    
    item_res = {
        "num": idx,
        "title": title,
        "uid": uid,
        "link_720p": link_720p,
        "available_qualities": list(qualities.keys()),
        "selected_link": best_link
    }
    results.append(item_res)
    print(f"[{idx}/{len(playlist_videos)}] {title}")
    if link_720p:
        print(f"   720p Link: {link_720p}")
    else:
        print(f"   720p NOT found. Selected: {best_link}")
    
    time.sleep(0.1)

with open("playlist_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nDone! Output saved to playlist_results.json")
