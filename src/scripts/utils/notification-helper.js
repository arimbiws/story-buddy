import { config } from "../config";

const NotificationHelper = {
  async requestPermission() {
    if (!("Notification" in window)) {
      console.log("Browser tidak mendukung notifikasi.");
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === "granted";
  },

  async checkSubscriptionStatus() {
    if (!("serviceWorker" in navigator)) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  },

  async subscribePush() {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready;

    // 1. Subscribe ke Browser (Push Manager)
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const urlBase64ToUint8Array = (base64String) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.PUSH_MSG_VAPID_PUBLIC_KEY),
      };

      subscription = await registration.pushManager.subscribe(subscribeOptions);
    }

    // 2. KIRIM DATA SUBSCRIPTION KE SERVER DICODING (Langkah yang sebelumnya hilang)
    const token = localStorage.getItem("token");
    if (token) {
      await this._sendSubscriptionToAPI(subscription, token);
    }

    console.log("Berhasil Subscribe:", JSON.stringify(subscription));
    return subscription;
  },

  async unsubscribePush() {
    if (!("serviceWorker" in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Unsubscribe dari browser
      await subscription.unsubscribe();

      // Opsional: Hapus juga dari server (jika API mendukung delete)
      // await this._deleteSubscriptionFromAPI(subscription);

      console.log("Berhasil Unsubscribe");
      return true;
    }
  },

  // Fungsi Helper Private untuk Fetch ke API
  async _sendSubscriptionToAPI(subscription, token) {
    try {
      // 1. Konversi subscription ke JSON Object standard
      const subscriptionJson = subscription.toJSON();

      // 2. FILTER DATA: Ambil hanya endpoint dan keys.
      // Kita membuang 'expirationTime' agar server tidak menolak request.
      const payload = {
        endpoint: subscriptionJson.endpoint,
        keys: subscriptionJson.keys,
      };

      const response = await fetch(config.PUSH_MSG_SUBSCRIBE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Kirim payload yang sudah bersih
        body: JSON.stringify(payload),
      });

      const responseJson = await response.json();
      console.log("Respon Server Notifikasi:", responseJson);

      if (!response.ok) {
        throw new Error(responseJson.message || "Gagal mengirim subscription ke server");
      }
    } catch (error) {
      console.error("Gagal mengirim subscription ke server:", error);
      // Kita tidak melempar error agar flow di UI tetap dianggap sukses (karena subscribe browser berhasil)
    }
  },
};

export default NotificationHelper;
