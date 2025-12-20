import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { config } from "./config";

// 1. Precache App Shell
precacheAndRoute(self.__WB_MANIFEST);

// 2. Caching Strategy (Sama seperti sebelumnya)
registerRoute(
  ({ url }) => url.href.startsWith(`${config.API_BASE}/stories`),
  new StaleWhileRevalidate({
    cacheName: "stories-api-response",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// 3. Push Notification Listener
self.addEventListener("push", (event) => {
  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data = { title: "Story Buddy", options: { body: event.data.text() } };
  }

  const title = data.title || "Story Buddy";

  // 2. Perbaikan Data Payload: Ambil properti options dari payload server
  // Payload dari server biasanya berbentuk: { title: "...", options: { body: "...", data: { storyId: "..." } } }
  const payloadOptions = data.options || {};

  const options = {
    body: payloadOptions.body || "Ada cerita baru nih!",
    icon: "./images/icons/maskable_icon_x192.png",
    badge: "./images/icons/maskable_icon_x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      // Simpan storyId jika dikirim oleh server, agar bisa dipakai saat diklik
      storyId: payloadOptions.data?.storyId || null,
    },
    actions: [
      { action: "explore", title: "Lihat" },
      { action: "close", title: "Tutup" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 4. Notification Click Listener
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 3. Perbaikan Action Check: Cek "explore" sesuai definisi di atas
  if (event.action === "explore" || !event.action) {
    // Ambil storyId yang sudah diamankan di tahap push
    const storyId = event.notification.data.storyId;

    // Jika ada ID buka detail, jika tidak buka home
    const targetUrl = storyId ? `/stories/${storyId}` : "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Cek apakah tab sudah terbuka
        for (let client of windowClients) {
          // Jika URL cocok atau berada di base URL, fokuskan
          if (client.url.includes(self.registration.scope) && "focus" in client) {
            // Opsional: Navigate client ke URL target jika belum di sana
            if (!client.url.includes(storyId)) {
              client.navigate(targetUrl);
            }
            return client.focus();
          }
        }
        // Jika tidak ada tab terbuka, buka window baru
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  }
});
