import DBHelper from "../../utils/db-helper";
import "../../components/story-card.js";

const FavoritesPage = {
  async render() {
    return `
      <div class="container">
        <h2 class="content-title" style="margin-top: 2rem;">Cerita Favorit</h2>
        <div id="favorite-stories" class="story-list" style="margin-top: 1rem;"></div>
      </div>
    `;
  },

  async afterRender() {
    // Ambil data dari IndexedDB Favorites

    const stories = await DBHelper.getAllFavorites();
    const container = document.getElementById("favorite-stories");

    if (stories.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; width: 100%; grid-column: 1/-1;">
            <p>Belum ada cerita favorit.</p>
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
