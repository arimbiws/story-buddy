import AuthModel from "../../models/auth-model";
import RegisterPresenter from "./register-presenter";

const RegisterPage = {
  async render() {
    return `
      <div class="auth-page" id="register-page">
        <section class="auth-section">
          <header class="auth-header">
            <h1>Buat Akun Baru</h1>
          </header>
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Nama Lengkap</label>
              <input id="name" name="name" type="text" placeholder="Enter Name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" placeholder="Enter Email" required />
            </div>
            <div class="form-group">
              <label for="password">Kata Sandi</label>
              <input id="password" name="password" type="password" placeholder="Enter Password" required />
            </div>
            <button type="submit" class="btn-primary" id="registerBtn">Daftar</button>
            <p class="auth-note">
              Sudah punya akun? <a href="/login" data-link>Login di sini</a>
            </p>
          </form>
        </section>
      </div>
    `;
  },

  async afterRender() {
    const model = new AuthModel();
    const presenter = new RegisterPresenter({ view: this, model });

    const form = document.getElementById("registerForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      presenter.onRegister({ name, email, password });
    });
  },

  setLoading(isLoading) {
    const button = document.getElementById("registerBtn");
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
    } else {
      button.disabled = false;
      button.innerHTML = "Daftar";
    }
  },
};

export default RegisterPage;
