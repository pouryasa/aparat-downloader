import { AparatVideoRaw, EpisodeResult, PlaylistResponseData } from "../types.js";

/**
 * Extracts Aparat playlist numeric ID from a full URL, partial string, or raw ID.
 */
export function extractPlaylistId(input: string): string | null {
  if (!input) return null;
  const cleanInput = input.trim();

  // Direct numeric ID check
  if (/^\d+$/.test(cleanInput)) {
    return cleanInput;
  }

  // URL patterns:
  // https://www.aparat.com/playlist/21933286
  // https://www.aparat.com/v/playlist/21933286
  const match = cleanInput.match(/playlist\/(\d+)/i) || cleanInput.match(/playlist_id\/(\d+)/i);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Fetches playlist metadata and all video download links concurrently in batches.
 */
export async function fetchAparatPlaylist(urlOrId: string): Promise<PlaylistResponseData> {
  const playlistId = extractPlaylistId(urlOrId);

  if (!playlistId) {
    throw new Error("شناسه یا لینک پلی‌لیست نامعتبر است. لطفاً لینک کامل مانند https://www.aparat.com/playlist/21933286 وارد کنید.");
  }

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
  };

  const playlistApiUrl = `https://www.aparat.com/api/fa/v1/video/playlist/one/playlist_id/${playlistId}`;
  const playlistResponse = await fetch(playlistApiUrl, { headers });

  if (!playlistResponse.ok) {
    throw new Error(`پلی‌لیستی با شناسه ${playlistId} یافت نشد یا دسترسی به آن امکان‌پذیر نیست.`);
  }

  const playlistData = await playlistResponse.json();

  let playlistTitle = "پلی‌لیست آپارات";
  if (playlistData?.data?.attributes?.title) {
    playlistTitle = playlistData.data.attributes.title;
  }

  const included = playlistData.included || [];
  const rawVideos: AparatVideoRaw[] = [];

  for (const item of included) {
    if (item.type === "Video") {
      const attrs = item.attributes || {};
      rawVideos.push({
        index: attrs.index_playlist || rawVideos.length + 1,
        uid: attrs.uid,
        title: attrs.title,
        duration: attrs.duration,
        smallPoster: attrs.small_poster || attrs.medium_poster
      });
    }
  }

  if (rawVideos.length === 0) {
    throw new Error("ویدئویی در این پلی‌لیست پیدا نشد.");
  }

  // Sort videos by playlist index
  rawVideos.sort((a, b) => Number(a.index) - Number(b.index));

  // Helper to fetch details for a single video
  const fetchVideoDetails = async (video: AparatVideoRaw): Promise<EpisodeResult> => {
    try {
      const videoApiUrl = `https://www.aparat.com/api/fa/v1/video/video/show/videohash/${video.uid}`;
      const vidResp = await fetch(videoApiUrl, { headers });
      if (!vidResp.ok) throw new Error("Video API request failed");

      const vidData = await vidResp.json();
      const attrs = vidData?.data?.attributes || {};
      const fileLinkAll = attrs.file_link_all || [];

      const qualities: Record<string, string> = {};
      for (const item of fileLinkAll) {
        const profile = item.profile; // e.g. "720p", "480p", "1080p", etc.
        const urls = item.urls || [];
        if (profile && urls.length > 0) {
          qualities[profile] = urls[0];
        }
      }

      const link720p = qualities["720p"] || null;
      const selectedLink = link720p || qualities["1080p"] || qualities["480p"] || qualities["360p"] || (Object.values(qualities)[0] as string) || "N/A";

      return {
        index: video.index,
        title: video.title,
        uid: video.uid,
        duration: video.duration,
        smallPoster: video.smallPoster,
        link_720p: link720p,
        all_qualities: qualities,
        selected_link: selectedLink
      };
    } catch {
      return {
        index: video.index,
        title: video.title,
        uid: video.uid,
        duration: video.duration,
        smallPoster: video.smallPoster,
        link_720p: null,
        all_qualities: {},
        selected_link: "N/A"
      };
    }
  };

  // Process in concurrent chunks of 10
  const chunkSize = 10;
  const episodes: EpisodeResult[] = [];

  for (let i = 0; i < rawVideos.length; i += chunkSize) {
    const chunk = rawVideos.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(fetchVideoDetails));
    episodes.push(...chunkResults);
  }

  return {
    playlistId,
    playlistTitle,
    totalEpisodes: episodes.length,
    episodes
  };
}
