# Aparat Playlist Video Link Extractor (دانلودر و استخراج‌کننده لینک‌های پلی‌لیست آپارات)

یک ابزار فرانت‌اند/بک‌اند سریع و کاربردی به زبان **TypeScript** و **React** برای دریافت مستقیم و یکجای تمامی لینک‌های دانلود ویدیوهای موجود در پلی‌لیست‌های وب‌سایت **آپارات (Aparat.com)** با کیفیت‌های مختلف (پشتیبانی ویژه از 720p، 1080p، 480p، 360p و غیره).

---

## 🌟 ویژگی‌ها (Features)

- ⚡ **پشتیبانی از انواع پلی‌لیست‌ها**: دریافت لینک از روی آدرس کامل یا ID پلی‌لیست آپارات.
- 🎯 **تفکیک کیفیت‌ها (Multi-Quality Support)**: انتخاب آسان بین کیفیت‌های مختلف (`1080p`, `720p`, `480p`, `360p`, `240p`, `144p`).
- 📥 **خروجی متنی برای IDM (Internet Download Manager)**: دانلود فایل `.txt` حاوی تمامی لینک‌ها جهت درج مستقیم در بخش Batch Download نرم‌افزارهای مدیریت دانلود.
- 📋 **کپی یکجای لینک‌ها**: کپی کردن همه لینک‌ها یا لینک هر جلسه به‌صورت جداگانه تنها با یک کلیک.
- 🕒 **تاریخچه پلی‌لیست‌های اخیر (Recent Playlists)**: ذخیره‌سازی خودکار پلی‌لیست‌های واردشده در مرورگر جهت دسترسی سریع مجدد بدون نیاز به شناسه.
- 🔍 **جستجو و فیلتر سریع**: جستجوی لحظه‌ای بر اساس شماره جلسه یا عنوان ویدیو.
- 🎨 **رابط کاربری مدرن و واکنش‌گرا**: طراحی زیبای حالت تاریک (Dark Mode) با فونت وزیرمتن و جهت‌نما راست‌به‌چپ (RTL).

---

## 🛠️ تکنولوژی‌ها و معماری (Architecture & Tech Stack)

معماری پروژه به‌طور کامل تفکیک‌شده و ماژولار است تا توسعه‌های آتی به‌سادگی امکان‌پذیر باشد:

### 🖥️ بخش بک‌اند (Backend Services)
- **مکان فایل‌ها**: `/server/`
- **تکنولوژی‌ها**: Node.js, Express, ESBuild / TSX
- **سرویس‌ها و مسیرها**:
  - `server/services/aparatService.ts`: سرویس استخراج هوشمند ID پلی‌لیست و فراخوانی هم‌زمان (Batch Fetching) کیفیت‌های مختلف از API آپارات.
  - `server/routes/playlist.ts`: تعریف API Endpoint مجزا برای پردازش درخواست‌های `/api/playlist`.
  - `server/types.ts`: تایپ‌ها و اینترفیس‌های مربوط به API آپارات.

### 🎨 بخش فرانت‌اند (Frontend Client)
- **مکان فایل‌ها**: `/src/`
- **تکنولوژی‌ها**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vazirmatn Font
- **اجزای ماژولار**:
  - `src/components/`: اجزای تفکیک‌شده UI (شامل Header, PlaylistInput, RecentPlaylists, QualityFilter, EpisodeCard, EmptyState, Footer)
  - `src/services/api.ts`: کلاینت فراخوانی API جهت ارتباط با سرویس بک‌اند
  - `src/types/index.ts`: اینترفیس‌های عمومی فرانت‌اند

---

## 🚀 راهنمای نصب و اجرا (Installation & Setup)

1. **کلون کردن مخزن (Clone the repository)**:
   ```bash
   git clone https://github.com/pouryasa/aparat-playlist-downloader.git
   cd aparat-playlist-downloader
   ```

2. **نصب وابستگی‌ها (Install Dependencies)**:
   ```bash
   npm install
   ```

3. **اجرای محیط توسعه (Development Server)**:
   ```bash
   npm run dev
   ```
   برنامه روی آدرس `http://localhost:3000` در دسترس خواهد بود.

4. **ساخت نسخه پروداکشن (Build)**:
   ```bash
   npm run build
   npm start
   ```

---

## 📖 نحوه استفاده (Usage)

1. آدرس کامل یا ID پلی‌لیست موردنظر خود را از آپارات کپی کنید (مثال: `https://www.aparat.com/playlist/21933286`).
2. آدرس را در کادر متنی بالای صفحه قرار داده و روی دکمه **"استخراج لینک‌ها"** کلیک کنید.
3. کیفیت مورد نظر (مثلاً **720p**) را انتخاب نمایید.
4. با زدن دکمه **"دانلود TXT برای IDM"**، فایل متنی لینک‌ها را دریافت و در نرم‌افزار IDM وارد کنید (منوی *Tasks -> Import -> From text file*).

---

## 📬 ارتباط با توسعه‌دهنده (Contact)

- **GitHub**: [github.com/pouryasa](https://github.com/pouryasa)
- **Telegram**: [@pourya_sss](https://t.me/pourya_sss)
- **Email**: [pourya.salimi.dev@gmail.com](mailto:pourya.salimi.dev@gmail.com)

---

## 📄 لایسنس (License)

این پروژه تحت لایسنس [MIT](LICENSE) منتشر شده است.
