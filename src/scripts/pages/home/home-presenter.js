import { navigateTo } from "../../index";

class HomePresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
    this._stories = []; // Menyimpan semua cerita yang diambil
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
    } finally {
      this.view.hideLoading();
    }
  }

  // Fitur pencarian cerita
  searchStories(query) {
    if (!query) {
      // Jika query kosong, tampilkan semua cerita
      this.view.showStoriesList(this._stories);
      return;
    }

    // Filter cerita berdasarkan nama atau deskripsi yang mengandung query
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
