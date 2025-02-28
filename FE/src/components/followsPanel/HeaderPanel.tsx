import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Хук для локализации
import { $api } from "../../api/api"; // API-клиент для запросов к серверу
import { RootState } from "../../store/store"; // Типизация корневого состояния Redux
import { useSelector } from "react-redux"; // Хук для получения данных из Redux

// Интерфейс для пропсов компонента HeaderPanel
interface IFollowPanel {
  userId: string; // ID пользователя, для которого загружаются данные
}

// Интерфейс локального состояния для подписчиков, подписок и постов
export interface ILocalFollow {
  followers: number | "Loading..."; // Количество подписчиков (или статус загрузки)
  following: number | "Loading..."; // Количество подписок (или статус загрузки)
  posts: number | "Loading..."; // Количество постов (или статус загрузки)
}

const HeaderPanel: FC<IFollowPanel> = ({ userId }) => {
  const { t } = useTranslation(); // Получаем функцию для перевода строк
  const currentUser = useSelector((state: RootState) => state.auth.user); // Получаем текущего пользователя из Redux
  
  // Локальное состояние для хранения количества подписчиков, подписок и постов
  const [follow, setFollow] = useState<ILocalFollow>({
    followers: "Loading...",
    following: "Loading...",
    posts: "Loading...",
  });

  // Эффект, который загружает данные о пользователе при изменении userId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Выполняем три запроса параллельно (для постов, подписчиков и подписок)
        const [postsRes, followersRes, followingRes] = await Promise.all([
          $api.get(`/posts/all/${userId}`), // Запрос на получение всех постов пользователя
          $api.get(`/follows/followers/${userId}`), // Запрос на подписчиков
          $api.get(`/follows/following/${userId}`), // Запрос на подписки
        ]);
        
        // Обновляем состояние с полученными данными
        setFollow({
          posts: postsRes.data.posts.length, // Количество постов
          followers: followersRes.data.length, // Количество подписчиков
          following: followingRes.data.length, // Количество подписок
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error); // Логируем ошибку в консоль
      }
    };

    if (userId) {
      // Устанавливаем статус загрузки перед запросами
      setFollow({ followers: "Loading...", following: "Loading...", posts: "Loading..." });
      fetchUserData(); // Вызываем функцию загрузки данных
    }
  }, [userId]); // useEffect срабатывает при изменении userId

  // Если пользователь не авторизован, показываем сообщение об ошибке
  if (!currentUser) return <div>{t("currentUserProfile.error")}</div>;

  return (
    <>
      {/* Отображаем количество постов, если данные загружены */}
      {follow.posts !== "Loading..." && (
        <p>
          <span style={{ fontWeight: "bold" }}>{follow.posts}</span> {t("currentUserProfile.posts")}
        </p>
      )}
      {/* Отображаем количество подписчиков, если данные загружены */}
      {follow.followers !== "Loading..." && (
        <p>
          <span style={{ fontWeight: "bold" }}>{follow.followers}</span> {t("currentUserProfile.followers")}
        </p>
      )}
      {/* Отображаем количество подписок, если данные загружены */}
      {follow.following !== "Loading..." && (
        <p>
          <span style={{ fontWeight: "bold" }}>{follow.following}</span> {t("currentUserProfile.following")}
        </p>
      )}
    </>
  );
};

export default HeaderPanel; // Экспортируем компонент
