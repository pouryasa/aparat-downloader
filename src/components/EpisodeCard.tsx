import React from 'react';
import { Download, Copy, Check, Video } from 'lucide-react';
import { Episode, QualityType } from '../types';

interface EpisodeCardProps {
  episode: Episode;
  selectedQuality: QualityType;
  copiedUid: string | null;
  onCopyLink: (link: string, uid: string) => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  selectedQuality,
  copiedUid,
  onCopyLink,
}) => {
  // Determine link for selected quality, falling back if unavailable
  const targetLink =
    episode.all_qualities[selectedQuality] ||
    episode.link_720p ||
    episode.selected_link ||
    'N/A';

  const isCopied = copiedUid === episode.uid;

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-lg">
      <div className="flex items-center gap-3.5 min-w-0 flex-1 w-full">
        {/* Poster / Placeholder */}
        <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
          {episode.smallPoster ? (
            <img
              src={episode.smallPoster}
              alt={episode.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Video className="w-5 h-5 text-slate-600" />
          )}
          <span className="absolute bottom-1 right-1 bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded text-rose-400 font-mono">
            #{episode.index}
          </span>
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-rose-300 transition line-clamp-2 leading-relaxed break-words">
            {episode.title}
          </h3>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
        <a
          href={targetLink !== 'N/A' ? targetLink : '#'}
          download
          target="_blank"
          rel="noreferrer"
          className={`p-2.5 rounded-xl border text-xs font-medium transition flex items-center justify-center gap-1.5 ${
            targetLink !== 'N/A'
              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/20'
              : 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed pointer-events-none'
          }`}
          title="دانلود مستقیم"
        >
          <Download className="w-4 h-4" />
          <span className="sm:hidden text-xs">دانلود</span>
        </a>

        <button
          onClick={() => onCopyLink(targetLink, episode.uid)}
          disabled={targetLink === 'N/A'}
          className={`p-2.5 rounded-xl border text-xs font-medium transition flex items-center justify-center gap-1.5 ${
            isCopied
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
          }`}
          title="کپی لینک"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="sm:hidden text-xs text-emerald-400">کپی شد</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span className="sm:hidden text-xs">کپی لینک</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
