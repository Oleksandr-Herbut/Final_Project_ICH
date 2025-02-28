import styles from "../NotificationModal.module.css"; // Импортирует стили CSS для компонента.
import { FC, useState, useEffect } from "react"; // Импортирует функции из React: FC (Function Component), useState и useEffect.
import { $api } from "../../../api/api"; // Импортирует объект $api для взаимодействия с API.
import parseData from "../../../utils/utils"; // Импортирует функцию parseData из утилит.
import { Notification, User } from "../../../store/types/instanceTypes"; // Импортирует типы Notification и User из типов.
import { getUserByIdApi } from "../../../utils/utils"; // Импортирует функцию getUserByIdApi из утилит.

const NotificationItem: FC<Notification> = ({
  _id,
  actionMaker,
  post,
  createdAt,
  type,
}) => {
  const [read, setRead] = useState(false); // Хук состояния для отметки прочитанности уведомления.
  const [user, setUser] = useState<User | null>(null); // Хук состояния для хранения информации о пользователе.

  // Загружаем данные пользователя и статус уведомления
  useEffect(() => {
    const fetchUser = async () => { // Асинхронная функция для получения данных о пользователе.
      try {
        const data = await getUserByIdApi(actionMaker);
        setUser(data);

        // Проверка состояния уведомления (прочитано ли)
        const readStatus = localStorage.getItem(`notification${_id}-read`); // Получение статуса прочитанности из localStorage.
        if (readStatus === "true") {
          setRead(true); // Установка статуса прочитанности.
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error); // Обработка ошибки.
      }
    };

    const checkNotificationStatus = async () => { // Асинхронная функция для проверки статуса уведомления.
      try {
        const data = await $api.get(`/notifications/${_id}`);
        setRead(data.data.isRead); // Обновляем статус уведомления.
      } catch (error) {
        console.error("Ошибка при получении статуса уведомления:", error); // Обработка ошибки.
      }
    };

    fetchUser(); // Вызов функции для получения данных пользователя.
    checkNotificationStatus(); // Вызов функции для проверки статуса уведомления.
  }, [actionMaker, _id]); // Хук useEffect выполняется при изменении actionMaker или _id.

  // Отметка уведомления как прочитанного
  const handleReadNotification = async () => {
    try {
      await $api.patch(`/notifications/${_id}`, { isRead: true }); // Запрос к API для отметки уведомления как прочитанного.
      setRead(true); // Установка статуса прочитанности.
      localStorage.setItem(`notification${_id}-read`, "true"); // Обновление localStorage.
    } catch (error) {
      console.error("Ошибка при отметке уведомления как прочитанного:", error); // Обработка ошибки.
    }
  };

  const profileImage = user?.profile_image; // Получение URL изображения профиля пользователя.
  const username = user?.username || "Unknown User"; // Получение имени пользователя или "Unknown User", если имя не задано.
  const postPreview = post?.photos && post.photos.length > 0 ? post.photos[0]?.url : null; // Получение URL предварительного просмотра поста.

  // Текст уведомления в зависимости от типа
  const getNotificationText = () => {
    switch (type) {
      case "liked your post":
        return "liked your post";
      case "liked your comment":
        return "liked your comment";
      case "commented on your post":
        return "commented on your post";
      case "started following you":
        return "started following you";
      default:
        return "sent you a notification";
    }
  };

  return (
    <li
      key={_id}
      className={styles.notificationItem}
      style={{ background: !read ? "#f3f3f3" : "#FFF" }} // Изменение фона в зависимости от статуса прочитанности.
    >
      <div className={styles.userAvatar_box}>
        <img src={profileImage} alt={username} className={styles.avatar} /> {/* Аватар пользователя */}
        <div>
          <p className={styles.notificationText}>
            <span className={styles.userName}>{username}</span> {getNotificationText()} {/* Имя пользователя и текст уведомления */}
          </p>
          {postPreview && (
            <div className={styles.postPreview}>
              <img src={postPreview} alt="Post Preview" className={styles.postImage} /> {/* Изображение поста, если оно есть */}
            </div>
          )}
          <p className={styles.parsedData}>{parseData(createdAt)}</p> {/* Дата создания уведомления */}
        </div>
      </div>
      <div>
        {!read && (
          <button className={styles.notBtn} onClick={handleReadNotification}>
            Read {/* Кнопка для отметки уведомления как прочитанного */}
          </button>
        )}
      </div>
    </li>
  );
};

export default NotificationItem; // Экспорт компонента NotificationItem по умолчанию.
