import React from 'react';
import { History, ListVideo, Trash2 } from 'lucide-react';
import { RecentPlaylist } from '../types';

interface RecentPlaylistsProps {
  recentPlaylists: RecentPlaylist[];
  currentUrl: string;
  onSelectPlaylist: (url: string) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export const RecentPlaylists: React.FC<RecentPlaylistsProps> = ({
  recentPlaylists,
  currentUrl,
  onSelectPlaylist,
  onClearHistory,
  isLoading,
}) => {
  if (recentPlaylists.length === 0) return null;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <History className="w-3.5 h-3.5 text-rose-400" />
          <span>پلی‌لیست‌های اخیر شما</span>
        </div>
        <button
          onClick={onClearHistory}
          disabled={isLoading}
          className="hover:text-rose-400 transition flex items-center gap-1 text-[11px]"
          title="پاک کردن تاریخچه"
        >
          <Trash2 className="w-3 h-3" />
          <span>پاک‌سازی</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentPlaylists.map((item, idx) => {
          const isActive = currentUrl.trim() === item.url.trim();
          return (
            <button
              key={idx}
              onClick={() => onSelectPlaylist(item.url)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-2 max-w-full sm:max-w-xs min-w-0 ${
                isActive
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ListVideo className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
