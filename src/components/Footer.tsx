import React from 'react';
import { Github, Mail, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/60 py-6 mt-12 relative select-none">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span
            className="font-medium text-slate-300"
            title="Aparat Playlist Downloader"
          >
            ارتباط با توسعه‌دهنده
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a
            href="https://github.com/pouryasa"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
          >
            <Github className="w-4 h-4" />
            <span className="font-mono">github.com/pouryasa</span>
          </a>

          <a
            href="https://t.me/pourya_sss"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span className="font-mono inline-block dir-ltr" dir="ltr">@pourya_sss</span>
          </a>

          <a
            href="mailto:pourya.salimi.dev@gmail.com"
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition"
          >
            <Mail className="w-4 h-4" />
            <span className="font-mono">pourya.salimi.dev@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

