import DBHelper from "../../utils/db-helper";
import "../../components/story-card.js";

const FavoritesPage = {
  async render() {
    return `
      <section class="container favorites-page">
        <header class="page-header">
          <h1 class="page-title">Cerita Favorit</h1>
          <p class="page-subtitle">Lihat kembali cerita-cerita yang telah Anda simpan sebagai favorit</p>
        </header>

        <div id="favorite-stories" class="story-list" style="margin-top: 1rem;">
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Ambil data dari IndexedDB Favorites
    const stories = await DBHelper.getAllFavorites();
    const container = document.getElementById("favorite-stories");

    if (stories.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; width: 100%; grid-column: 1/-1;">
            <p style="margin-bottom: 2rem; color: gray;">Belum ada cerita favorit.</p>
            <a href="/" class="btn-primary" style="text-decoration:none;">Explore Cerita</a>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    stories.forEach((story) => {
      const storyCard = document.createElement("story-card");
      storyCard.story = story;
      container.appendChild(storyCard);
    });
  },
};

export default FavoritesPage;
