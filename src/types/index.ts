export interface QualityLinks {
  [key: string]: string;
}


export interface Episode {
  index: string | number;
  title: string;
  uid: string;
  duration?: string | number;
  smallPoster?: string;
  link_720p: string | null;
  all_qualities: QualityLinks;
  selected_link: string;
}

export interface RecentPlaylist {
  url: string;
  title: string;
}

export interface PlaylistApiResponse {
  playlistId: string;
  playlistTitle: string;
  totalEpisodes: number;
  episodes: Episode[];
  error?: string;
}

export type QualityType = '1080p' | '720p' | '480p' | '360p' | '240p' | '144p';
