import AddStoryPresenter from "./story-presenter";
import StoriesModel from "../../models/stories-model";
import initCamera from "../../utils/camera";
import L from "leaflet";

const StoryPage = {
  // State Lokasi Jakarta sebagai default
  _currentLat: -6.175392,
  _currentLon: 106.827153,

  async render() {
    return `
      <div class="container add-story-page">
        <header class="page-header">
          <h1 class="page-title">Tambah Cerita</h1>
          <p class="page-subtitle">Bagikan pengalamanmu dengan foto dan lokasi</p>
        </header>

        <section class="form-section">
          <form id="storyForm" class="story-form">
            <div class="form-group">
              <label for="description">Deskripsi Cerita</label>
              <textarea id="description" placeholder="Tulis deskripsi cerita kamu..." required></textarea>
            </div>

            <div class="form-group photo-inputs">
              <label for="photo">Unggah Foto</label>
              <div class="photo-actions">
                <button type="button" id="openCameraBtn" aria-label="Buka kamera untuk mengambil foto">Buka Kamera</button>

                <input type="file" id="photo" accept="image/*" required />
              </div>
            </div>
            
            <section id="cameraSection" class="camera-section" hidden>
              <div class="camera-wrapper">
                <video id="camera" autoplay></video>
              </div>
              <div class="camera-controls">
              <button id="closeCameraBtn" class="btn-secondary" type="button">Tutup Kamera</button>
              <button id="captureBtn" class="btn-primary" type="button">Ambil Foto</button>
              </div>
            </section>

            <section class="map-section">
              <label>Pilih Lokasi</label>
              <div id="map-add" class="map-container"></div>

              <div class="coords-group">
                <div class="coord-field">
                  <label for="lat">Latitude</label>
                  <input id="lat" type="text" placeholder="Latitude" readonly />
                </div>
                <div class="coord-field">
                  <label for="lon">Longitude</label>
                  <input id="lon" type="text" placeholder="Longitude" readonly />
                </div>
              </div>
            </section>

            <button type="submit" class="btn-primary">Kirim Cerita</button>
          </form>
        </section>
      </div>
    `;
  },

  async afterRender() {
    // Inisialisasi Presenter dan Model
    const model = new StoriesModel();
    const presenter = new AddStoryPresenter({ view: this, model });

    // Inisialisasi Helper UI (Peta & Kamera)
    this._initMap();
    this._initCameraListeners();

    // Event Listener Form Submit
    const form = document.getElementById("storyForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Ambil data dari form
      const description = document.getElementById("description").value;
      const photo = document.getElementById("photo").files[0];

      // Panggil Presenter untuk proses upload
      presenter.onUpload({
        description,
        photo,
        lat: this._currentLat,
        lon: this._currentLon,
      });
    });
  },

  // Logika Peta (Leaflet) tetap di View karena ini manipulasi DOM langsung
  _initMap() {
    const map = L.map("map-add", {
      keyboard: false,
      tap: false,
    }).setView([this._currentLat, this._currentLon], 12);

    // tambahin layer seperti di home page
    const defaultLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    const satellite = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png");

    defaultLayer.addTo(map);
    L.control.layers({ Default: defaultLayer, Satellite: satellite }).addTo(map);

    const marker = L.marker([this._currentLat, this._currentLon]).addTo(map);

    // Update state saat peta diklik
    map.on("click", (e) => {
      this._currentLat = e.latlng.lat;
      this._currentLon = e.latlng.lng;

      marker.setLatLng([this._currentLat, this._currentLon]);

      // Update input koordinat
      document.getElementById("lat").value = this._currentLat.toFixed(6);
      document.getElementById("lon").value = this._currentLon.toFixed(6);

      // Tampilkan notifikasi lokasi terpilih
      Swal.fire({
        icon: "info",
        title: "Lokasi Dipilih",
        text: `Koordinat (${this._currentLat.toFixed(6)}, ${this._currentLon.toFixed(6)}) telah dipilih.`,
        showConfirmButton: false,
        timer: 1500,
      });
    });

    // Mendapatkan lokasi user saat ini
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this._currentLat = pos.coords.latitude;
          this._currentLon = pos.coords.longitude;
          map.setView([this._currentLat, this._currentLon], 13);
          marker.setLatLng([this._currentLat, this._currentLon]);

          document.getElementById("lat").value = this._currentLat.toFixed(6);
          document.getElementById("lon").value = this._currentLon.toFixed(6);
        },
        () => {
          document.getElementById("lat").value = this._currentLat.toFixed(6);
          document.getElementById("lon").value = this._currentLon.toFixed(6);
        }
      );
    }
  },

  // Logika Kamera menggunakan helper camera.js
  _initCameraListeners() {
    const openBtn = document.getElementById("openCameraBtn");
    const closeBtn = document.getElementById("closeCameraBtn");
    const cameraSection = document.getElementById("cameraSection");
    let stopCamera = null;

    openBtn.addEventListener("click", async () => {
      cameraSection.hidden = false;
      stopCamera = await initCamera(); // Menggunakan helper camera.js Anda
    });

    closeBtn.addEventListener("click", () => {
      cameraSection.hidden = true;
      if (stopCamera) stopCamera();
    });
  },
};

export default StoryPage;
