import axios from "axios";

const base_url = "http://localhost:3000/api";

export const $api = axios.create({ baseURL: base_url });

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Получаем токен из localStorage
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const socketURL = "http://ichgram:3000";
