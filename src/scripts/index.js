// import "regenerator-runtime";
// CSS imports
import "../styles/style.css";
import "./components/x-navbar";
import "./components/x-footer";
import Swal from "sweetalert2";
import { Workbox } from "workbox-window";
import DBHelper from "./utils/db-helper";

import App from "./pages/app";
import { addStory } from "./data/api";

window.Swal = Swal; // agar bisa dipakai di komponen manapun

const app = new App({
  content: document.getElementById("main-content"),
});

// gunakan hash routing supaya sesuai url-parser yang mengandalkan location.hash
export const navigateTo = (url) => {
  // untuk memastikan url diawali dengan '/'
  if (!url.startsWith("/")) url = "/" + url;
  // set hash -> menghasilkan http://localhost:9000/login
  window.location.hash = url;
};

// SERVICE WORKER & PWA
if ("serviceWorker" in navigator) {
  const wb = new Workbox("/sw.js");
  // const wb = new Workbox(`${process.env.PUBLIC_URL || ""}/sw.js`);

  wb.addEventListener("waiting", () => {
    // Prompt user to reload for update
    console.log("New service worker installed");
  });

  wb.register();
}

// PUSH NOTIFICATION STATE CHECK
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then(async (registration) => {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      localStorage.setItem("push-subscribed", "true");
    }
  });
}
// SYNC (ADVANCED)
// Ketika kembali online, upload data dari antrian
window.addEventListener("online", async () => {
  console.log("Kembali Online! Memproses antrian...");
  const queue = await DBHelper.getAllQueue();

  if (queue.length > 0) {
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sinkronisasi data...",
      showConfirmButton: false,
      timer: 3000,
    });

    const token = localStorage.getItem("token");

    // Fungsi untuk mengubah base64 ke Blob
    const base64ToBlob = (base64, contentType = "image/jpeg") => {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    };

    for (const item of queue) {
      try {
        let photoFile = null;

        if (item.photoBase64) {
          const blob = base64ToBlob(item.photoBase64, item.photoType || "image/jpeg");
          // Buat File agar addStory bisa menangani seperti input biasa
          photoFile = new File([blob], `offline-${item.timestamp || Date.now()}.jpg`, { type: item.photoType || "image/jpeg" });
        }

        await addStory({
          description: item.description,
          photo: photoFile,
          lat: item.lat,
          lon: item.lon,
          token,
        });

        // Hapus dari antrian jika sukses
        await DBHelper.deleteFromQueue(item.id);
      } catch (error) {
        console.error("Gagal sync item:", item, error);
      }
    }

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Semua data offline berhasil diunggah!",
      showConfirmButton: false,
      timer: 3000,
    });

    // refresh halaman jika sedang di root page
    if (window.location.hash === "" || window.location.hash === "/") {
      window.dispatchEvent(new Event("hashchange"));
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await app.renderPage();
});

window.addEventListener("hashchange", async () => {
  await app.renderPage();
});

// Tangani event click pada skip-to-content agar tidak memicu hashchange
const skipLink = document.querySelector(".skip-to-content");

if (skipLink) {
  skipLink.addEventListener("click", (event) => {
    event.preventDefault(); // Mencegah browser melakukan navigasi hash

    // Ambil target (dalam kasus Anda adalah #main-content)
    const targetId = event.target.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.focus();
    }
  });
}
