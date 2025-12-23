import { navigateTo } from "../../index";

class StoryPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async onUpload({ description, photo, lat, lon }) {
    // Logika Validasi (Presenter Logic)
    if (!description) {
      return Swal.fire("Peringatan", "Deskripsi tidak boleh kosong.", "warning");
    }
    if (!photo) {
      return Swal.fire("Peringatan", "Silakan ambil atau pilih foto.", "warning");
    }
    if (!lat || !lon) {
      return Swal.fire("Peringatan", "Silakan pilih lokasi pada peta.", "warning");
    }

    try {
      // Tampilkan Loading
      Swal.fire({
        title: "Mengunggah Cerita...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Panggil Model untuk mengirim data
      await this.model.createStory({ description, photo, lat, lon });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Cerita Anda telah ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigateTo("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunggah Cerita",
        text: error.message || "Terjadi kesalahan saat mengirim cerita.",
      });
    }
  }
}

export default StoryPresenter;
