import { navigateTo } from "../../index";

class RegisterPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async onRegister({ name, email, password }) {
    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Semua kolom wajib diisi",
      });
      return;
    }

    this.view.setLoading(true);

    try {
      await this.model.register(name, email, password);

      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Silakan login dengan akun barumu.",
      });

      navigateTo("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error.message || "Gagal mendaftarkan akun.",
      });
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default RegisterPresenter;
