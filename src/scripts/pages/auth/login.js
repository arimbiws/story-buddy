import AuthModel from "../../models/auth-model";
import LoginPresenter from "./login-presenter";

const LoginPage = {
  async render() {
    return `
      <div class="auth-page" id="login-page">
        <section class="auth-section">
          <header class="auth-header">
            <h1>Masuk ke Story Buddy</h1>
          </header>

          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" placeholder="Enter Email" required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter Password" required />
            </div>

            <button type="submit" class="btn-primary">Masuk</button>
            <p class="auth-note">
              Belum punya akun? <a href="/register" data-link>Daftar di sini</a>
            </p>
          </form>
        </section>
      </div>
    `;
  },

  async afterRender() {
    // Inisialisasi MVP
    const model = new AuthModel();
    const presenter = new LoginPresenter({ view: this, model });

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Panggil Presenter
      presenter.onLogin({ email, password });
    });
  },

  // Method manipulasi DOM dipanggil oleh Presenter
  setLoading(isLoading) {
    const button = document.querySelector(".btn-primary");

    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
    } else {
      button.disabled = false;
      button.innerHTML = "Masuk";
    }
  },
};

export default LoginPage;
