import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { config } from "./config";

// 1. Precache App Shell
precacheAndRoute(self.__WB_MANIFEST);

// 2. Caching API (StaleWhileRevalidate)
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

// 3. Caching Image (CacheFirst)
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

// 4. Push Notification Listener
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

  // Ambil options dari payload server, atau fallback
  // Payload dari server biasanya berbentuk: { title: "...", options: { body: "...", data: { storyId: "..." } } }
  const payloadOptions = data.options || {};

  const options = {
    body: payloadOptions.body || "Ada cerita baru!",
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

// 5. Notification Click Listener
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore" || !event.action) {
    // Ambil storyId yang sudah diamankan di tahap push
    // Navigasi ke URL detail atau home
    // Sesuaikan hash routing: /#/stories/:id atau /
    const storyId = event.notification.data.storyId;
    // Jika ada ID buka detail, jika tidak buka home
    const targetUrl = storyId ? `/stories/${storyId}` : "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Cek apakah tab sudah terbuka
        for (let client of windowClients) {
          // Jika URL cocok atau berada di base URL, fokuskan
          if (client.url.includes(self.registration.scope) && "focus" in client) {
            // Navigate client ke URL target jika belum di sana
            // Jika sudah ada tab terbuka, arahkan dan fokuskan
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
