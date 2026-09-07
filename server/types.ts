export interface AparatVideoRaw {
  index: number | string;
  uid: string;
  title: string;
  duration?: number | string;
  smallPoster?: string;
}

export interface QualityLinks {
  [key: string]: string;
}

export interface EpisodeResult {
  index: number | string;
  title: string;
  uid: string;
  duration?: number | string;
  smallPoster?: string;
  link_720p: string | null;
  all_qualities: QualityLinks;
  selected_link: string;
}

export interface PlaylistResponseData {
  playlistId: string;
  playlistTitle: string;
  totalEpisodes: number;
  episodes: EpisodeResult[];
}
