import axios from "axios";

// 1. Set the base URL for your backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // <-- UPDATE THIS to your backend's URL
});

// 2. Automatically attach the token to every request
API.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default API;
