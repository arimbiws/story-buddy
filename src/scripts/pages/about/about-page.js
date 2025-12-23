const AboutPage = {
  async render() {
    return `
      <section class="container about-page">
        <header class="page-header">
          <h2 class="page-title">Tentang Story Buddy</h2>
          <p class="page-subtitle">Pelajari lebih lanjut tentang aplikasi Story Buddy dan tujuannya</p>
        </header>

        <div class="about-section">
          <h3>Deskripsi Aplikasi</h3>
          <p>
            Story Buddy adalah aplikasi web yang memungkinkan pengguna untuk berbagi cerita dan pengalaman mereka dengan menambahkan lokasi dan foto. Pengguna dapat melihat cerita dari pengguna lain di seluruh Indonesia melalui peta interaktif dan daftar cerita.
          </p>
          <br />
          <h3>Tujuan Aplikasi</h3>
          <p>
            Aplikasi ini dibuat untuk memudahkan pengguna dalam membagikan pengalaman atau kisah mereka kepada dunia, lengkap dengan lokasi kejadian dan foto pendukung.
          </p>
          <br />  
          <h3>Teknologi yang Digunakan</h3>
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
