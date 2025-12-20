import DBHelper from "../utils/db-helper"; // Import helper DB

class StoryCard extends HTMLElement {
  set story(data) {
    this._story = data;
    this.render();
  }

  async render() {
    // Cek status favorit dari IndexedDB
    const isFavorite = await DBHelper.getFavorite(this._story.id);
    const heartIconClass = isFavorite ? "fa-solid" : "fa-regular";
    const heartColor = isFavorite ? "red" : "gray";

    this.innerHTML = `
      <div class="story-card">
        <img src="${this._story.photoUrl}" alt="${this._story.name}" class="story-image"  loading="lazy"/>
        <div class="story-content">
          <h3 class="story-title">${this._story.name}</h3>
          <p class="story-description">${this._story.description}</p>

          <div class="card-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <button class="btn-favorite" aria-label="Simpan ke favorit" style="background:none; border:none; cursor:pointer; font-size: 1.5rem; color: ${heartColor};">
              <i class="${heartIconClass} fa-heart"></i>
            </button>

            <button class="btn-detail">Detail</button>
          </div>
        </div>
      </div>
    `;

    this._addDetailListener();
    this._addFavoriteListener();
  }

  _addDetailListener() {
    this.querySelector(".btn-detail").addEventListener("click", () => {
      if (this._story.lat && this._story.lon && window.focusStoryOnMap) {
        window.focusStoryOnMap(this._story.lat, this._story.lon, this._story.name);
      }

      Swal.fire({
        title: this._story.name,
        html: `
          <img src="${this._story.photoUrl}" alt="picture uploaded by ${this._story.name}" style="width:100%;border-radius:8px;margin-bottom:10px;">
          <p>
            <strong>Deskripsi:</strong>
            <br>
            ${this._story.description}
          </p>
          <br />
          ${
            this._story.lat && this._story.lon
              ? `
          <p>
            <strong>Lokasi:</strong> <br />
            (${this._story.lat}, ${this._story.lon})
          </p>`
              : ""
          }
        `,
        confirmButtonText: "Tutup",
        width: "500px",
      });
    });
  }

  _addFavoriteListener() {
    const favBtn = this.querySelector(".btn-favorite");
    const icon = favBtn.querySelector("i");

    favBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const isFavorite = await DBHelper.getFavorite(this._story.id);

      if (isFavorite) {
        // Hapus dari favorit
        await DBHelper.deleteFavorite(this._story.id);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        favBtn.style.color = "gray";

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "Dihapus dari favorit",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Simpan ke favorit
        await DBHelper.putFavorite(this._story);
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        favBtn.style.color = "red";

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Disimpan ke favorit",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Jika berada di halaman favorit, refresh halaman untuk update list
      if (window.location.hash === "/favorites") {
        window.dispatchEvent(new Event("hashchange"));
      }
    });
  }
}

customElements.define("story-card", StoryCard);
