import { navigateTo } from "../../index";

class LoginPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async onLogin({ email, password }) {
    // Validasi Input
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Email dan password wajib diisi",
      });
      return;
    }

    // Tampilkan Loading di View
    this.view.setLoading(true);

    try {
      // Panggil Model
      const response = await this.model.login(email, password);

      // Simpan token di localStorage
      localStorage.setItem("token", response.loginResult.token);

      // Update state auth global (agar navbar dan lainnya tahu sudah login)
      window.dispatchEvent(new Event("authChanged"));

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang kembali.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigateTo("/");
    } catch (error) {
      // Handle Error
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message || "Terjadi kesalahan pada server.",
      });
    } finally {
      // Matikan Loading
      this.view.setLoading(false);
    }
  }
}

export default LoginPresenter;
