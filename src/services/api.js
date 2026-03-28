//const BASE_URL = "http://localhost:5000/api";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── HELPERS ──────────────────────────────────

// ─── PUBLIC ADS ───────────────────────────────

export const getAds = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.sort) params.append("sort", filters.sort);
  const res = await fetch(`${BASE_URL}/ads?${params.toString()}`);
  return res.json();
};

export const getAdById = async (id) => {
  const res = await fetch(`${BASE_URL}/ads/${id}`);
  return res.json();
};

export const createAd = async (formData) => {
  const res = await fetch(`${BASE_URL}/ads`, {
    method: "POST",
    body: formData, // FormData for image upload
  });
  return res.json();
};

// ─── ADMIN ────────────────────────────────────

export const adminLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getAdminStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  return res.json();
};

export const getAdminAds = async (status = "") => {
  const url = status
    ? `${BASE_URL}/admin/ads?status=${status}`
    : `${BASE_URL}/admin/ads`;
  const res = await fetch(url);
  return res.json();
};

export const updateAdStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/admin/ads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const deleteAd = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/ads/${id}`, { method: "DELETE" });
  return res.json();
};

// ─── AUTH ─────────────────────────────────────

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("userInfo");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
};