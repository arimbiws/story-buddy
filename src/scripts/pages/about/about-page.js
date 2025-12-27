const AboutPage = {
  async render() {
    return `
      <section class="container about-page">
        <header class="page-header">
          <h1 class="page-title">Tentang Story Buddy</h1>
          <p class="page-subtitle">Pelajari lebih lanjut tentang aplikasi Story Buddy dan tujuannya</p>
        </header>

        <div class="about-section">
          <h2>Deskripsi Aplikasi</h2>
          <p>
            Story Buddy adalah aplikasi web yang memungkinkan pengguna untuk berbagi cerita dan pengalaman mereka dengan menambahkan lokasi dan foto. Pengguna dapat melihat cerita dari pengguna lain di seluruh Indonesia melalui peta interaktif dan daftar cerita.
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
