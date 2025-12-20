const AboutPage = {
  async render() {
    return `
      <section class="about-page container">
        <h1>Tentang Story Buddy</h1>

        <div class="about-content">
          <p>
            Story Buddy adalah aplikasi sederhana untuk berbagi cerita disertai foto dan lokasi. 
            Dibangun dengan menggunakan API Dicoding.
          </p>
          <br />
          <h2>Tujuan Aplikasi</h2>
          <p>
            Aplikasi ini dibuat untuk memudahkan pengguna dalam membagikan pengalaman atau kisah mereka kepada dunia, lengkap dengan lokasi kejadian dan foto pendukung.
          </p>
          <br />  
          <h2>Teknologi yang Digunakan</h2>
          <p>
            Story Buddy dikembangkan menggunakan HTML, CSS, dan JavaScript modern dengan arsitektur modular, serta API dari Dicoding Story untuk pengelolaan data cerita.
          </p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Tidak ada interaksi dinamis saat ini
  },
};

export default AboutPage;
