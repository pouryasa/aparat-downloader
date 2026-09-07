import { PlaylistApiResponse } from '../types';

export async function fetchPlaylistFromApi(targetUrl: string): Promise<PlaylistApiResponse> {
  const response = await fetch('/api/playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: targetUrl }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'خطایی در دریافت اطلاعات پلی‌لیست رخ داد.');
  }

  return data;
}
