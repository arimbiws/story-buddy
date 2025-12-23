import { openDB } from "idb";
import { config } from "../config";
const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = config;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Store untuk menyimpan data cerita (Read saat offline)
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });

    // Store untuk menyimpan antrian upload (Sync saat kembali online)
    // Menggunakan autoIncrement true karena data offline belum punya ID dari server
    database.createObjectStore("offline-queue", { keyPath: "id", autoIncrement: true });

    // Favorites (Bookmark)
    database.createObjectStore("favorites", { keyPath: "id" });
  },
});

const DBHelper = {
  // --- Fitur Read/Cache Data ---
  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putStory(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async putStories(stories) {
    const db = await dbPromise;
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_NAME);
    // Kosongkan dulu agar data fresh (opsional, tergantung strategi)
    await store.clear();
    for (const story of stories) {
      store.put(story);
    }
    return tx.done;
  },

  // --- Fitur Advanced: Synchronization Queue ---
  async saveToQueue(storyData) {
    return (await dbPromise).add("offline-queue", storyData);
  },
  async getAllQueue() {
    return (await dbPromise).getAll("offline-queue");
  },
  async deleteFromQueue(id) {
    return (await dbPromise).delete("offline-queue", id);
  },

  // --- FAVORITES (BOOKMARK) ---
  async getFavorite(id) {
    return (await dbPromise).get("favorites", id);
  },
  async getAllFavorites() {
    return (await dbPromise).getAll("favorites");
  },
  async putFavorite(story) {
    return (await dbPromise).put("favorites", story);
  },
  async deleteFavorite(id) {
    return (await dbPromise).delete("favorites", id);
  },
};

export default DBHelper;
