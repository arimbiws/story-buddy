import HomePresenter from "./home-presenter";
import StoriesModel from "../../models/stories-model";
import renderMap from "../../utils/maps";
import "../../components/story-card.js";
import { gsap } from "gsap";
import NotificationHelper from "../../utils/notification-helper"; // Import baru

const HomePage = {
  async render() {
    return `
      <main class="container home-page">
        <header class="page-header">
          <h1 class="page-title">Beranda Cerita</h1>
          <p class="page-subtitle">Lihat kisah dan lokasi para pengguna di seluruh Indonesia</p>
        </header>

        <div id="loading-container"></div>
        <div id="offline-banner" style="display:none; background: #ffeba7; padding: 10px; text-align: center; border-radius: 8px; margin-bottom: 10px;">
           Anda sedang offline. Data yang ditampilkan mungkin tidak terbaru.
        </div>

        <section id="map-section" aria-label="Peta Lokasi Cerita">
          <div id="map"></div>
        </section>

        <section id="stories-section" aria-label="Daftar Cerita">
          <h2 class="section-title">Daftar Cerita</h2>
          <!-- INPUT PENCARIAN (Syarat Skilled IDB) -->
          <div class="search-wrapper">
            <input 
              type="text" 
              id="searchStories" 
              placeholder="Cari cerita berdasarkan nama atau deskripsi..." 
              class="form-control"
              style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ccc;"
            />
          </div>
          <div id="stories" class="story-list"></div>
        </section>
      </main>
    `;
  },

  async afterRender() {
    // Inisialisasi MVP Pattern [cite: 174, 175]
    const model = new StoriesModel();
    const presenter = new HomePresenter({ view: this, model });

    // Cek status online/offline
    window.addEventListener("online", () => this._updateOnlineStatus());
    window.addEventListener("offline", () => this._updateOnlineStatus());
    this._updateOnlineStatus();

    // Setup Pencarian
    const searchInput = document.getElementById("searchStories");
    searchInput.addEventListener("input", (e) => {
      presenter.searchStories(e.target.value);
    });

    // Panggil Presenter untuk memulai logika [cite: 178]
    await presenter.showStories();

    // Animasi UI (Tugas View)
    this._animateElements();
  },

  _updateOnlineStatus() {
    const banner = document.getElementById("offline-banner");
    if (!navigator.onLine) {
      banner.style.display = "block";
    } else {
      banner.style.display = "none";
    }
  },

  _initNotificationButton() {
    const btn = document.getElementById("notifToggle");
    if (!("Notification" in window)) {
      btn.style.display = "none";
      return;
    }

    btn.addEventListener("click", async () => {
      const granted = await NotificationHelper.requestPermission();
      if (granted) {
        await NotificationHelper.subscribePush();
        btn.innerText = "Notifikasi Aktif";
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        Swal.fire("Berhasil", "Anda akan menerima notifikasi cerita baru.", "success");
      } else {
        Swal.fire("Gagal", "Izin notifikasi ditolak.", "error");
      }
    });
  },

  showLoading() {
    const container = document.getElementById("loading-container");
    container.innerHTML = '<div class="loader" style="text-align:center; padding:2rem;">Memuat data...</div>';
  },

  hideLoading() {
    const container = document.getElementById("loading-container");
    container.innerHTML = "";
  },

  showStoriesList(stories) {
    const container = document.getElementById("stories");
    container.innerHTML = "";

    if (stories.length === 0) {
      container.innerHTML = "<p style='text-align:center; col-span: 3;'>Tidak ada cerita ditemukan.</p>";
      return;
    }

    stories.forEach((story) => {
      const card = document.createElement("story-card");
      card.story = story;
      container.appendChild(card);
    });
  },

  initMap(stories) {
    renderMap(stories);
  },

  _animateElements() {
    gsap.from("#map-section", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
    gsap.from("#stories-section", { opacity: 0, y: 50, duration: 0.8, delay: 0.3, ease: "power2.out" });
  },
};

export default HomePage;
