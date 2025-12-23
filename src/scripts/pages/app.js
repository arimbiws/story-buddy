import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { navigateTo } from "../index"; // Pastikan import navigateTo

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes["/"]; // fallback ke home

    // Daftar halaman yang boleh diakses tanpa login
    const publicRoutes = ["/login", "/register"];
    const token = localStorage.getItem("token");
    
    // Jika user belum login DAN mencoba akses halaman selain publicRoutes
    if (!token && !publicRoutes.includes(url)) {
      // Redirect ke login
      navigateTo("/login");
      return;
    }
    
    // Jika user SUDAH login tapi akses login/register, lempar ke home
    if (token && publicRoutes.includes(url)) {
      navigateTo("/");
      return;
    }
    
    // Eksekusi fungsi dynamic import
    // Karena routes sekarang berisi fungsi: () => import(...)
    const pageModule = await page(); 
    
    const content = this.#content; // ngambil elemen konten

    // Gunakan pageModule sebagai object page
    if (!document.startViewTransition) {
      content.innerHTML = await pageModule.render();
      await pageModule.afterRender();
      return;
    }

    document.startViewTransition(async () => {
      content.innerHTML = await pageModule.render();
      await pageModule.afterRender();
    });
  }
}

export default App;
