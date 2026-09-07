import React, { useState } from 'react';
import { Download, Copy, Check, ListFilter, Search, Info, Terminal, FileText, ChevronDown } from 'lucide-react';
import { QualityType } from '../types';

interface QualityFilterProps {
  selectedQuality: QualityType;
  onChangeQuality: (q: QualityType) => void;
  searchTerm: string;
  onChangeSearchTerm: (term: string) => void;
  onCopyAll: () => void;
  copiedAll: boolean;
  onDownloadEF2: () => void;
  onDownloadIDMBat: () => void;
  onDownloadBat: () => void;
  onDownloadTxt: () => void;
  totalEpisodes: number;
}

const QUALITY_OPTIONS: QualityType[] = ['1080p', '720p', '480p', '360p', '240p', '144p'];

export const QualityFilter: React.FC<QualityFilterProps> = ({
  selectedQuality,
  onChangeQuality,
  searchTerm,
  onChangeSearchTerm,
  onCopyAll,
  copiedAll,
  onDownloadEF2,
  onDownloadIDMBat,
  onDownloadBat,
  onDownloadTxt,
  totalEpisodes,
}) => {
  const [showMoreDownloads, setShowMoreDownloads] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Quality Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium ml-1 shrink-0 flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5 text-rose-400" />
            کیفیت:
          </span>
          {QUALITY_OPTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onChangeQuality(q)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedQuality === q
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Export / Download Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Main IDM Script Button - 1 Click Queue adding */}
          <button
            onClick={onDownloadIDMBat}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 min-h-[38px] whitespace-nowrap active:scale-95"
            title="انتقال خودکار ویدیوها به IDM همراه با نام فارسی و شماره ترتیب"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">اسکریپت افزودن به IDM (.bat)</span>
          </button>

          {/* Copy All Button */}
          <button
            onClick={onCopyAll}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 min-h-[38px] whitespace-nowrap"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-bold whitespace-nowrap">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="whitespace-nowrap">کپی همه ({totalEpisodes})</span>
              </>
            )}
          </button>

          {/* More Download Options Dropdown Toggle */}
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowMoreDownloads(!showMoreDownloads)}
              className="w-full sm:w-auto px-3.5 sm:px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 min-h-[38px] whitespace-nowrap"
              title="فرمت‌های دیگر دانلود"
            >
              <span className="whitespace-nowrap">فرمت‌های دیگر</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${showMoreDownloads ? 'rotate-180' : ''}`} />
            </button>

            {showMoreDownloads && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-20 space-y-1">
                <button
                  onClick={() => {
                    onDownloadEF2();
                    setShowMoreDownloads(false);
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <div className="font-semibold">فایل IDM Export (.ef2)</div>
                    <div className="text-[10px] text-slate-500">منوی Tasks → Import در IDM</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onDownloadBat();
                    setShowMoreDownloads(false);
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold">دانلود مستقیم ویندوز (curl .bat)</div>
                    <div className="text-[10px] text-slate-500">دانلود مستقیم در CMD بدون نیاز به IDM</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onDownloadTxt();
                    setShowMoreDownloads(false);
                  }}
                  className="w-full text-right px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-semibold">فایل TXT ساده</div>
                    <div className="text-[10px] text-slate-500">فقط لیست آدرس‌ها (بدون نام)</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IDM Instruction Guide Banner */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-rose-300">
        <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 leading-relaxed">
          <p className="font-bold text-rose-200">
            روش مطمئن و ۱۰۰٪ تست‌شده برای انتقال ویدیوها با نام فارسی و شماره ترتیب به IDM:
          </p>
          <p className="text-slate-300">
            ۱. روی دکمه قرمز رنگ <strong className="text-rose-300 font-bold">"اسکریپت افزودن به IDM (.bat)"</strong> کلیک و فایل را دانلود کنید.
          </p>
          <p className="text-slate-300">
            ۲. فایل دانلودشده (با پسوند <code className="text-rose-300 font-mono">.bat</code>) را اجرا (دابل کلیک) کنید. تمامی ویدیوها با عنوان کامل فارسی و شماره ترتیب (مانند <span dir="ltr" className="inline-block font-mono text-[11px] bg-slate-950 px-1.5 py-0.2 rounded text-rose-300">01 - عنوان ویدیو.mp4</span>) مستقیماً به صف دانلود نرم‌افزار IDM اضافه خواهند شد!
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
        <input
          type="text"
          placeholder="جستجو در قسمتها..."
          value={searchTerm}
          onChange={(e) => onChangeSearchTerm(e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-800 focus:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition"
        />
      </div>
    </div>
  );
};
