import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://quantitymeasurementapp-production-1dc5.up.railway.app";

const API = axios.create({
  baseURL: BASE_URL,
});

// interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;