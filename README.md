# 📖 Story Buddy App

Story Buddy adalah aplikasi web berbasis **Single Page Application (SPA)** yang memungkinkan pengguna untuk berbagi cerita lengkap dengan foto dan lokasi, menyimpan cerita favorit, serta menikmati pengalaman **Progressive Web App (PWA)** dengan dukungan **offline mode** hingga **push notification**.

---

## 🚀 Fitur Utama

- 🔐 Autentikasi pengguna (Login & Register)
- 🗺️ Peta interaktif untuk menampilkan lokasi cerita
- 📝 Tambah cerita baru dengan foto dan lokasi
- ❤️ Simpan & kelola cerita favorit (IndexedDB)
- 🔎 Pencarian cerita berdasarkan nama & deskripsi
- 🔔 Push Notification real-time
- 📦 Progressive Web App (Installable & Offline)
- 📶 Mode offline dengan sinkronisasi data otomatis

---

## 🧩 Teknologi yang Digunakan

- JavaScript (ES6+)
- Webpack
- Workbox (Service Worker)
- IndexedDB (idb)
- Leaflet.js (Maps)
- SweetAlert2
- GSAP Animation
- REST API Dicoding Story API

---

## 🏗️ Struktur Proyek

```
story-buddy/
├── src/
│   ├── public/
│   │   ├── images/
│   │   │   ├── icons/
│   │   │   │   ├── maskable_icon_x48.png
│   │   │   │   ├── maskable_icon_x72.png
│   │   │   │   ├── maskable_icon_x96.png
│   │   │   │   ├── maskable_icon_x128.png
│   │   │   │   ├── maskable_icon_x192.png
│   │   │   │   ├── maskable_icon_x384.png
│   │   │   │   ├── maskable_icon_x512.png
│   │   │   │   └── maskable_icon.png
│   │   │   ├── screenshots/
│   │   │   │   ├── story-buddy-desktop.png
│   │   │   │   └── story-buddy-mobile.png
│   │   │   └── logo.png
│   │   └── manifest.json
│   ├── scripts/
│   │   ├── components/
│   │   │   ├── story-card.js
│   │   │   ├── x-footer.js
│   │   │   └── x-navbar.js
│   │   ├── data/
│   │   │   └── api.js
│   │   ├── models/
│   │   │   ├── auth-model.js
│   │   │   └── stories-model.js
│   │   ├── pages/
│   │   │   ├── about/
│   │   │   │   └── about-page.js
│   │   │   ├── auth/
│   │   │   │   ├── login-presenter.js
│   │   │   │   ├── login.js
│   │   │   │   ├── register-presenter.js
│   │   │   │   └── register.js
│   │   │   ├── home/
│   │   │   │   ├── home-page.js
│   │   │   │   └── home-presenter.js
│   │   │   ├── stories/
│   │   │   │   ├── add-story.js
│   │   │   │   ├── favorites.js
│   │   │   │   └── story-presenter.js
│   │   │   └── app.js
│   │   ├── routes/
│   │   │   ├── routes.js
│   │   │   └── url-parser.js
│   │   ├── utils/
│   │   │   ├── camera.js
│   │   │   ├── db-helper.js
│   │   │   ├── maps.js
│   │   │   └── notification-helper.js
│   │   ├── config.js
│   │   ├── index.js
│   │   └── sw.js
│   ├── styles/
│   │   └── style.css
│   ├── index.html
├── .gitignore
├── package.json
├── README.md
├── STUDENT.txt
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```


## 🧪 Kriteria Submission Dicoding - Proyek Kedua

### ✅ Kriteria 1 – SPA & Fitur Dasar
- SPA dengan hash routing
- Transisi halaman
- Peta & marker
- Tambah data cerita
- Aksesibilitas dasar

### ✅ Kriteria 2 – Push Notification (Advanced)
- Push dari server
- Payload dinamis
- Action button & navigasi
- Toggle subscribe notifikasi

### ✅ Kriteria 3 – PWA (Advanced)
- Installable (Desktop & Mobile)
- Offline mode (App Shell + Data)
- Manifest lengkap (icons, screenshots, shortcuts)
- Dynamic caching API

### ✅ Kriteria 4 – IndexedDB (Advanced)
- CRUD favorit
- Pencarian & interaktivitas
- Offline queue & sinkronisasi data

### ✅ Kriteria 5 – Deploy Publik
- Deploy ke GitHub Pages
- URL aktif & dapat diakses

---

## ⚙️ Cara Menjalankan Proyek (Local)

1. Clone repository:
   ```
   git clone https://github.com/arimbiws/story-buddy
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Jalankan mode development:
   ```
   npm run start-dev
   ```
4. Akses di browser:
   ```
   http://localhost:3000
   ```
   
