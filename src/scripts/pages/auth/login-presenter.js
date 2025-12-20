import Swal from "sweetalert2";
import { navigateTo } from "../../index";

class LoginPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async onLogin({ email, password }) {
    // 1. Validasi Input
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Email dan password wajib diisi",
      });
      return;
    }

    // 2. Tampilkan Loading di View
    this.view.setLoading(true);

    try {
      // 3. Panggil Model
      const response = await this.model.login(email, password);

      // 4. Handle Sukses
      // Simpan token (bisa juga di model, tapi umum di presenter/utils)
      localStorage.setItem("token", response.loginResult.token);

      // Update state auth global (opsional, trigger event custom)
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
      // 5. Handle Error
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message || "Terjadi kesalahan pada server.",
      });
    } finally {
      // 6. Matikan Loading
      this.view.setLoading(false);
    }
  }
}

export default LoginPresenter;
