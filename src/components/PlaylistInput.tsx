import React from 'react';
import { Link2, Loader2, AlertCircle } from 'lucide-react';

interface PlaylistInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onSampleClick?: (url: string) => void;
}

export const PlaylistInput: React.FC<PlaylistInputProps> = ({
  url,
  onChangeUrl,
  onSubmit,
  isLoading,
  errorMessage,
  onSampleClick,
}) => {
  return (
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-900/90 p-2 border border-slate-800 focus-within:border-rose-500 rounded-2xl shadow-xl transition">
          <div className="relative flex-1 flex items-center min-w-0">
            <div className="absolute right-3.5 text-slate-500 pointer-events-none">
              <Link2 className="w-5 h-5 shrink-0" />
            </div>

            <input
              type="text"
              dir="ltr"
              placeholder="https://www.aparat.com/playlist/21933286"
              value={url}
              onChange={(e) => onChangeUrl(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent text-slate-100 placeholder:text-slate-600 text-sm py-3 pr-11 pl-4 outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-rose-600/20 whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>در حال دریافت...</span>
              </>
            ) : (
              <span>استخراج لینک‌ها</span>
            )}
          </button>
        </div>
      </form>

      {/* Centered Sample Link Box under input */}
      {!url && onSampleClick && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
          <span>نمونه لینک:</span>
          <button
            type="button"
            onClick={() => onSampleClick('https://www.aparat.com/playlist/21933286')}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-mono transition dir-ltr active:scale-95 shadow-sm"
            dir="ltr"
          >
            <Link2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>https://www.aparat.com/playlist/21933286</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

