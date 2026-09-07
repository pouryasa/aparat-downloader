import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center space-y-3 relative">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 flex items-center justify-center">
        <span>دانلودر پلی لیست آپارات</span>
      </h1>
      <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
        لینک پلی‌لیست آپارات را وارد کنید تا تمام لینک‌های مستقیم ویدیوها با کیفیت‌های مختلف استخراج و آماده دانلود یکجا در IDM گردند.
      </p>
    </header>
  );
};
