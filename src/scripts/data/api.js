import { config } from "../config";

export const getStories = async (token) => {
  const res = await fetch(`${config.API_BASE}/stories?location=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Gagal mengambil cerita");
  return data.listStory || [];
};

export const addStory = async ({ description, photo, lat, lon, token }) => {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);

  if (lat && lon) {
    formData.append("lat", lat);
    formData.append("lon", lon);
  }

  const res = await fetch(`${config.API_BASE}/stories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengirim cerita");
  return result;
};

// Error handling agar masuk ke catch block Presenter
export const loginUser = async (email, password) => {
  const res = await fetch(`${config.API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Cek apakah response adalah JSON atau HTML (error dari server)
  const contentType = res.headers.get("content-type");
  console.log("Response Content-Type:", contentType);

  let result;
  try {
    result = await res.json();
  } catch (e) {
    console.error("Gagal parse JSON response:", e);
    const text = await res.text();
    console.error("Response body:", text);
    throw new Error("Server tidak mengembalikan JSON yang valid. Pastikan Anda menggunakan API endpoint yang benar.");
  }

  if (!res.ok) throw new Error(result.message || "Gagal login");
  return result;
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${config.API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal registrasi");
  return result;
};
