const initCamera = async () => {
  const video = document.getElementById("camera");
  const captureBtn = document.getElementById("captureBtn");
  const closeCameraBtn = document.getElementById("closeCameraBtn");
  const cameraSection = document.getElementById("cameraSection");
  const canvas = document.createElement("canvas");

  let stream = null;
  let stopCamera = () => {};

  if (!video || !captureBtn || !cameraSection) {
    console.error("Elemen kamera tidak ditemukan di DOM.");
    return stopCamera;
  }

  try {
    Swal.fire({
      title: "Mengaktifkan Kamera...",
      text: "Harap tunggu sebentar.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // mengaktifkan kamera
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    Swal.close(); // trus tutup loading

    video.srcObject = stream;
    video.setAttribute("playsinline", "");

    stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    // untuk ambil foto
    captureBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          const fileInput = document.getElementById("photo");
          if (!fileInput) return;

          const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;

          Swal.fire({
            icon: "success",
            title: "Foto Berhasil Diambil",
            text: "Foto sudah ditambahkan ke formulir cerita.",
            timer: 1500,
            showConfirmButton: false,
          });
        });

        // tutup kamera otomatis setelah capture
        cameraSection.hidden = true;
        stopCamera();
      },
      { once: true } // agar tidak menumpuk event listener
    );

    // tutup kamera manual
    if (closeCameraBtn) {
      closeCameraBtn.addEventListener(
        "click",
        () => {
          cameraSection.hidden = true;
          stopCamera();
        },
        { once: true }
      );
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Akses Kamera Ditolak",
      text: "Harap izinkan akses kamera agar dapat mengambil foto. " + "Periksa pengaturan browser Anda.",
    });
    console.error("Kamera gagal diakses:", err);
  }

  return stopCamera;
};

export default initCamera;
