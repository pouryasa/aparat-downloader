import React from 'react';
import { ListVideo, Link2, Download } from 'lucide-react';

interface EmptyStateProps {
  onSampleClick: (url: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSampleClick }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center space-y-4 my-8">
      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <ListVideo className="w-8 h-8" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-slate-200">
          هنوز پلی‌لیستی بارگذاری نشده است
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          برای شروع، آدرس کامل یا ID یک پلی‌لیست از وب‌سایت آپارات را در کادر بالا وارد کرده و دکمه **"استخراج لینک‌ها"** را بزنید.
        </p>
      </div>

      <div className="pt-2 flex flex-col items-center justify-center">
        <span className="text-xs text-slate-500 block mb-2 text-center">یا از این لینک نمونه امتحان کنید:</span>
        <button
          onClick={() => onSampleClick('https://www.aparat.com/playlist/21933286')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono rounded-xl border border-slate-700/80 transition dir-ltr max-w-full truncate shadow-sm active:scale-95"
          dir="ltr"
        >
          <Link2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="truncate">https://www.aparat.com/playlist/21933286</span>
        </button>
      </div>
    </div>
  );
};
