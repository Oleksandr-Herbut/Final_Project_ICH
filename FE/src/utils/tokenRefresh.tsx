import { useEffect } from "react";
import axios from "axios";

const useTokenRefresh = () => {
  useEffect(() => {
    const refreshInterval = 55 * 60 * 1000; // 55 минут

    const refresh = async () => {
      try {
        const response = await axios.post("/auth/refresh", {
          token: localStorage.getItem("token"),
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token); // Сохраняем новый токен
        } else {
          // Если обновить токен не удалось, перенаправляем на /login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Ошибка обновления токена:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    };

    const interval = setInterval(refresh, refreshInterval);

    return () => clearInterval(interval); // Очищаем таймер при размонтировании
  }, []);
};

export default useTokenRefresh;
