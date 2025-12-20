# App Starter Project with Webpack

Proyek ini adalah setup dasar untuk aplikasi web yang menggunakan webpack untuk proses bundling, Babel untuk transpile JavaScript, serta mendukung proses build dan serving aplikasi.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (disarankan versi 12 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Download starter project [di sini](https://raw.githubusercontent.com/dicodingacademy/a219-web-intermediate-labs/099-shared-files/starter-project-with-webpack.zip).
2. Lakukan unzip file.
3. Pasang seluruh dependencies dengan perintah berikut.
   ```
   npm install
   ```

## Scripts

- Build for Production:

  ```
  npm run build
  ```

  Script ini menjalankan webpack dalam mode production menggunakan konfigurasi `webpack.prod.js` dan menghasilkan sejumlah file build ke direktori `dist`.

- Start Development Server:

  ```
  npm run start-dev
  ```

  Script ini menjalankan server pengembangan webpack dengan fitur live reload dan mode development sesuai konfigurasi di`webpack.dev.js`.

- Serve:
  ```
  npm run serve
  ```
  Script ini menggunakan [`http-server`](https://www.npmjs.com/package/http-server) untuk menyajikan konten dari direktori `dist`.

## Project Structure

Proyek starter ini dirancang agar kode tetap modular dan terorganisir.

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
