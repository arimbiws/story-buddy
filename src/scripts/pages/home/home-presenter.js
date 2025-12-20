import { navigateTo } from "../../index";

class HomePresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
    this._stories = []; // Simpan data asli untuk keperluan filter/search
  }

  async showStories() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/login");
        return;
      }

      this.view.showLoading();

      // Ambil data dari Model (bisa dari API atau IDB jika offline)
      this._stories = await this.model.getAllStories();

      // Tampilkan data awal (semua cerita)
      this.view.showStoriesList(this._stories);
      this.view.initMap(this._stories);
    } catch (error) {
      console.error(error);
      // Opsional: Tampilkan pesan error di view
    } finally {
      this.view.hideLoading();
    }
  }

  // LOGIKA BARU: Pencarian Client-Side
  searchStories(query) {
    if (!query) {
      // Jika kosong, kembalikan ke list semula
      this.view.showStoriesList(this._stories);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredStories = this._stories.filter((story) => {
      const nameMatch = story.name.toLowerCase().includes(lowerQuery);
      const descMatch = story.description.toLowerCase().includes(lowerQuery);
      return nameMatch || descMatch;
    });

    this.view.showStoriesList(filteredStories);
  }
}

export default HomePresenter;
