import { getStories, addStory } from "../data/api";
import DBHelper from "../utils/db-helper";

class StoriesModel {
  // Mengambil seluruh cerita [cite: 23, 154]
  async getAllStories() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan. Harap login kembali.");
    }
    // Model memanggil API, bukan View [cite: 379]
    // return await getStories(token);

    try {
      // 1. Coba ambil dari Network
      const response = await getStories(token);

      // 2. Jika sukses, simpan ke IDB untuk cadangan offline
      await DBHelper.putStories(response);

      return response;
    } catch (error) {
      // 3. Jika Network gagal (Offline), ambil dari IDB
      console.warn("Offline Mode: Mengambil data dari IndexedDB");
      const offlineStories = await DBHelper.getAllStories();

      if (offlineStories.length > 0) {
        return offlineStories;
      }

      throw new Error("Gagal mengambil data offline dan cache kosong.");
    }
  }

  // Mengirim cerita baru
  async createStory(storyData) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan. Harap login kembali.");
    }
    // Normalisasi nama description (beberapa view mengirim 'desc')
    const description = storyData.description || storyData.desc || "";

    try {
      // Coba kirim langsung ke API
      return await addStory({
        description,
        photo: storyData.photo,
        lat: storyData.lat,
        lon: storyData.lon,
        token,
      });
    } catch (error) {
      // Jika gagal kirim (offline), simpan ke Queue IDB
      // Kita konversi File photo ke base64 agar bisa disimpan di IndexedDB
      if (!navigator.onLine) {
        try {
          let photoBase64 = null;
          let photoType = null;

          if (storyData.photo) {
            photoType = storyData.photo.type || "image/jpeg";
            photoBase64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                // hasil berupa data:<type>;base64,AAAA...
                const result = reader.result;
                const base64 = result.split(",")[1];
                resolve(base64);
              };
              reader.onerror = reject;
              reader.readAsDataURL(storyData.photo);
            });
          }

          await DBHelper.saveToQueue({
            description,
            lat: storyData.lat,
            lon: storyData.lon,
            photoBase64,
            photoType,
            timestamp: Date.now(),
          });

          return { offline: true, message: "Disimpan di antrian offline" };
        } catch (e) {
          console.error("Gagal menyimpan ke antrian offline:", e);
          throw e;
        }
      }

      throw error;
    }
  }
}

export default StoriesModel;
