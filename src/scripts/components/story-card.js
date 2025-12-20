class StoryCard extends HTMLElement {
  set story(data) {
    this._story = data;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="story-card">
        <img src="${this._story.photoUrl}" alt="${this._story.name}" class="story-image" />
        <div class="story-content">
          <h3 class="story-title">${this._story.name}</h3>
          <p class="story-description">${this._story.description}</p>
          <button class="btn-detail">Detail</button>
        </div>
      </div>
    `;

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
}

customElements.define("story-card", StoryCard);
