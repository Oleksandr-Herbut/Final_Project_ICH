import React, { useEffect, useState } from "react"; // Импортирует функции из React: useEffect и useState.
import { useSelector } from "react-redux"; // Импортирует хук useSelector из библиотеки React Redux.
import { $api } from "../../api/api"; // Импортирует объект $api для взаимодействия с API.
import { RootState } from "../../store/store"; // Импортирует тип RootState из store.
import NotificationItem from "./item/NotificationItem"; // Импортирует компонент NotificationItem.
import styles from "./NotificationModal.module.css"; // Импортирует стили CSS для компонента.
import { Notification } from "../../store/types/instanceTypes"; // Импортирует тип Notification из типов.

const NotificationModal: React.FC = () => { // Объявляет компонент NotificationModal с типизацией.
  const [notifications, setNotifications] = useState<Notification[] | null>(null); // Хук состояния для списка уведомлений.
  const [error, setError] = useState<string | null>(null); // Хук состояния для ошибки.

  const user = useSelector((state: RootState) => state.auth.user); // Получение текущего пользователя из состояния Redux.
  const token = useSelector((state: RootState) => state.auth.token); // Получение токена аутентификации из состояния Redux.

  useEffect(() => { // Хук useEffect для выполнения побочных эффектов.
    const fetchNotifications = async () => { // Асинхронная функция для получения уведомлений.
      if (!user || !token) { // Проверка на наличие пользователя и токена.
        setError("User is not authenticated"); // Установка ошибки, если пользователь не аутентифицирован.
        return;
      }

      try {
        const { data } = await $api.get(`/notifications/${user._id}/notifications`); // Запрос к API для получения уведомлений.
        setNotifications(data); // Установка полученных данных в состояние.
      } catch (err : any) {
        console.error("Error fetching notifications:", err); // Вывод ошибки в консоль.
        setError(err.response?.data?.error || "Failed to fetch notifications"); // Установка ошибки.
      }
    };

    fetchNotifications(); // Вызов функции для получения уведомлений.
  }, [user, token]); // Выполнение эффекта при изменении пользователя или токена.

  if (error) {
    return <div className={styles.error}>{error}</div>; // Отображение ошибки, если она есть.
  }

  if (!notifications) {
    return <div className={styles.loading}>Loading...</div>; // Отображение состояния загрузки, если уведомления не загружены.
  }

  // Разделяем уведомления на новые и прочитанные
  const newNotifications = notifications.filter(notification => !notification.isRead); // Фильтрация новых уведомлений.
  const oldNotifications = notifications.filter(notification => notification.isRead); // Фильтрация прочитанных уведомлений.

  for (const notification of notifications) { // Обновление localStorage в зависимости от статуса уведомлений.
    if (notification.isRead) {
      localStorage.setItem(`notification${notification._id}-read`, "true"); // Установка статуса прочитанности в localStorage.
    } else {
      localStorage.removeItem(`notification${notification._id}-read`); // Удаление статуса прочитанности из localStorage.
    }
  }

  return (
    <div className={styles.notificationsModal}>
      <header className={styles.header}>
        <h4>Notifications</h4>
        <h6>New</h6>
      </header>

      {newNotifications.length === 0 ? ( // Проверка наличия новых уведомлений.
        <div className={styles.noNotifications}>No new notifications available</div> // Отображение сообщения, если новых уведомлений нет.
      ) : (
        <ul className={styles.list}>
          {newNotifications.map((notification) => ( // Отображение новых уведомлений.
            <NotificationItem
              key={notification._id}
              {...notification} // Передача свойств уведомления компоненту NotificationItem.
            />
          ))}
        </ul>
      )}
      <h6 className={styles.old}>Old</h6>
      {oldNotifications.length === 0 ? ( // Проверка наличия прочитанных уведомлений.
        <div className={styles.noNotifications}>No old notifications available</div> // Отображение сообщения, если прочитанных уведомлений нет.
      ) : (
        <ul className={styles.list}>
          {oldNotifications.map((notification) => ( // Отображение прочитанных уведомлений.
            <NotificationItem
              key={notification._id}
              {...notification} // Передача свойств уведомления компоненту NotificationItem.
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationModal; // Экспорт компонента NotificationModal по умолчанию.
