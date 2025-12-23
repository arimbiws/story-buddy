import { navigateTo } from "../index.js";

class Navbar extends HTMLElement {
  constructor() {
    super();
    this._isSubscribed = false; // State internal untuk status notifikasi
  }

  async connectedCallback() {
    this.render();

    // Cek status notifikasi yang sebenarnya dari browser/SW
    await this._checkNotificationStatus();
    this._initDrawer(); // Inisialisasi drawer setelah render

    if (!this._authListenerAdded) {
      window.addEventListener("authChanged", () => {
        this.render();
        this._checkNotificationStatus(); // Cek lagi saat login/logout
      });
      this._authListenerAdded = true;
    }

    if (!this._notificationListenerAdded) {
      this._setupNotificationToggle();
      this._notificationListenerAdded = true;
    }
  }

  // Cek ke NotificationHelper apakah browser ini sudah subscribe
  async _checkNotificationStatus() {
    const { default: NotificationHelper } = await import("../utils/notification-helper.js");
    this._isSubscribed = await NotificationHelper.checkSubscriptionStatus();
    this.render(); // Render ulang agar icon/text tombol sesuai
  }

  async _setupNotificationToggle() {
    const { default: NotificationHelper } = await import("../utils/notification-helper.js");

    document.addEventListener("click", async (e) => {
      // Gunakan closest agar klik pada icon di dalam tombol juga terdeteksi
      const btn = e.target.closest("#notifToggleBtn");
      if (!btn) return;

      e.preventDefault();

      // button loading
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Proses...`;
      btn.disabled = true;

      try {
        if (this._isSubscribed) {
          // UNSUBSCRIBE
          const success = await NotificationHelper.unsubscribePush();
          if (success) {
            this._isSubscribed = false;
            await Swal.fire({
              icon: "info",
              title: "Notifikasi Dimatikan",
              text: "Anda tidak akan menerima notifikasi lagi.",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } else {
          // SUBSCRIBE
          const permissionGranted = await NotificationHelper.requestPermission();
          if (permissionGranted) {
            const subscription = await NotificationHelper.subscribePush();
            if (subscription) {
              this._isSubscribed = true;
              await Swal.fire({
                icon: "success",
                title: "Notifikasi Diaktifkan",
                text: "Anda akan menerima update cerita terbaru.",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          } else {
            await Swal.fire({
              icon: "warning",
              title: "Izin Ditolak",
              text: "Mohon izinkan notifikasi melalui pengaturan browser (icon gembok di URL bar).",
            });
          }
        }
      } catch (error) {
        console.error("Gagal toggle notifikasi:", error);
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat mengatur notifikasi.",
        });
      } finally {
        // render ulang untuk update tampilan tombol
        this.render();
      }
    });
  }

  _initDrawer() {
    const drawerButton = this.querySelector("#drawer-button");
    const navigationDrawer = this.querySelector("#navigation-drawer");
    const navLinks = this.querySelectorAll(".nav-list a");

    if (drawerButton && navigationDrawer) {
      drawerButton.addEventListener("click", (event) => {
        event.stopPropagation();
        navigationDrawer.classList.toggle("open");
      });

      document.body.addEventListener("click", (event) => {
        if (!navigationDrawer.contains(event.target) && !drawerButton.contains(event.target)) {
          navigationDrawer.classList.remove("open");
        }
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navigationDrawer.classList.remove("open");
        });
      });
    }
  }

  render() {
    const token = localStorage.getItem("token");

    // Navigasi drawer logic
    const nav = document.getElementById("navigation-drawer");
    if (nav && nav.classList.contains("open")) nav.classList.remove("open");

    // Tentukan tampilan tombol berdasarkan state this._isSubscribed
    const notifBtnClass = this._isSubscribed ? "btn-notif-active" : "btn-notif-inactive";
    const notifBtnIcon = this._isSubscribed ? "fa-bell" : "fa-bell-slash";
    const notifBtnTitle = this._isSubscribed ? "Matikan Notifikasi" : "Hidupkan Notifikasi";

    // Style inline sederhana untuk membedakan tombol aktif/nonaktif
    const activeStyle = "background-color: #2ecc71; color: white; border: none;";
    const inactiveStyle = "background-color: #e74c3c; color: white; border: none;";
    const btnStyle = this._isSubscribed ? activeStyle : inactiveStyle;

    this.innerHTML = `
    <header>
      <div class="main-header container">
        <div class="brand">
          <a href="/" data-link>
            <img src="./images/logo.png" alt="Story Buddy Logo" class="brand-logo"  />
          </a>
        </div>
        <nav id="navigation-drawer" class="navigation-drawer">
          <div class="drawer-header">
            <h2>Main Menu</h2>
          </div>

          <ul id="nav-list" class="nav-list">
            ${
              token
                ? `
                <li><a href="/" data-link>Daftar Cerita</a></li>
                <li><a href="/add-story" data-link>Buat Cerita</a></li>
                <li><a href="/favorites" data-link>Favorit</a></li>
                <li><a href="/about" data-link>Tentang</a></li>
                <li>
                  <!-- BUTTON TOGGLE NOTIFIKASI -->
                  <button id="notifToggleBtn" class="logout-btn" style="${btnStyle}" title="${notifBtnTitle}">
                    <i class="fa-solid ${notifBtnIcon}"></i> 
                  </button>
                </li>
                <li>
                  <button id="logoutBtn" class="logout-btn" title="Logout">
                    Logout <i class="fa-solid fa-right-from-bracket"></i>
                  </button>
                </li>
                `
                : `
                <li><a href="/register" id="regBtn" data-link>Register</a></li>
                <li><a href="/login" id="loginBtn" data-link>Login</a></li>
                `
            }
            </ul>
        </nav>
        <button aria-label="Buka navigasi" id="drawer-button" class="drawer-button">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </header> 
    `;
    this.addListeners();
  }

  addListeners() {
    const links = this.querySelectorAll("[data-link]");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const url = e.target.getAttribute("href");
        navigateTo(url);
      });
    });

    const logoutBtn = this.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        const result = await Swal.fire({
          title: "Yakin ingin logout?",
          text: "Anda harus login kembali nanti.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "Ya, logout",
        });

        if (result.isConfirmed) {
          localStorage.removeItem("token");
          // Reset state notifikasi saat logout
          this._isSubscribed = false;

          await Swal.fire("Logout Berhasil", "", "success");
          window.dispatchEvent(new Event("authChanged"));
          navigateTo("/login");
        }
      });
    }
  }
}

if (!customElements.get("x-navbar")) {
  customElements.define("x-navbar", Navbar);
}
