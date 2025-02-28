import React, { useEffect, useState } from "react"; // Импортируем React и хуки useEffect и useState из библиотеки React.
import { useTranslation } from "react-i18next"; // Импортируем хук useTranslation из библиотеки i18next для перевода.
import { useDispatch, useSelector } from "react-redux"; // Импортируем хуки useDispatch и useSelector из библиотеки React Redux.
import { useNavigate, Link } from "react-router-dom"; // Импортируем хуки useNavigate и компонент Link из библиотеки React Router.
import CustomButton from "../customButton/CustomButton"; // Импортируем компонент CustomButton.
import FollowsPanel from "../followsPanel/HeaderPanel"; // Импортируем компонент FollowsPanel.
import { fetchAllPosts } from "../../store/slices/postsSlice"; // Импортируем экшен для получения постов.
import { RootState } from "../../store/store"; // Импортируем тип RootState из файла store.
import styles from "./currentProfile.module.css"; // Импортируем стили CSS для компонента.
import webIcon from "../../assets/web.svg"; // Импортируем иконку вебсайта.
import { ThunkDispatch } from 'redux-thunk'; // Импортируем тип ThunkDispatch из библиотеки redux-thunk.
import { AnyAction } from 'redux'; // Импортируем тип AnyAction из библиотеки redux.

export interface ILocalFollow { // Интерфейс для состояния подписок/подписчиков/постов.
  followers: "Loading..." | number; // Количество подписчиков или строка "Loading...".
  following: "Loading..." | number; // Количество подписок или строка "Loading...".
  posts: "Loading..." | number; // Количество постов или строка "Loading...".
}

const CurrenProfile: React.FC = () => { // Объявляем компонент CurrenProfile с типизацией.
  const { t } = useTranslation(); // Используем хук useTranslation для перевода.
  const currentUser = useSelector((state: RootState) => state.auth.user); // Получаем текущего пользователя из состояния Redux.
  const { posts, loading, error } = useSelector((state: RootState) => state.posts); // Получаем посты, состояние загрузки и ошибки из состояния Redux.
  const navigate = useNavigate(); // Инициализируем navigate для навигации.
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch(); // Инициализируем dispatch для отправки действий в Redux.
  const [followStats, setFollowStats] = useState<ILocalFollow>({
    followers: "Loading...",
    following: "Loading...",
    posts: "Loading...",
  }); // Хук состояния для подписок/подписчиков/постов.

  useEffect(() => {
    dispatch(fetchAllPosts()); // Запрос постов при загрузке компонента.
  }, [dispatch]);

  if (!currentUser) return <div>{t("currentUserProfile.error")}</div>; // Если текущий пользователь не найден, отображаем ошибку.

  const handleEditClick = () => { // Функция для обработки клика по кнопке редактирования.
    navigate("/profile/edit"); // Переход на страницу редактирования профиля.
  };

  const updateFollowStats = (updatedStats: ILocalFollow | ((prev: ILocalFollow) => ILocalFollow)) => { // Функция для обновления состояния подписок/подписчиков/постов.
    setFollowStats(updatedStats);
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarInner}>
          <img src={currentUser.profile_image} alt={currentUser.username} /> {/* Изображение профиля текущего пользователя */}
        </div>
      </div>
      <div className={styles.userDetails}>
        <div className={styles.actionButtons}>
          <p>{currentUser.username}</p>
          <CustomButton
            className={styles.button}
            text={t("currentUserProfile.btnEdit")}
            style={{
              fontWeight: 600,
              color: "var(--color-text-dark)",
              width: "168.72px",
              backgroundColor: "var(--color-bg-dark-grey)",
            }}
            onClick={handleEditClick} // Обработка клика по кнопке редактирования.
          />
        </div>
        <div className={styles.stats}>
          <FollowsPanel
            userId={currentUser._id} // Идентификатор текущего пользователя.
            follow={followStats} // Состояние подписок/подписчиков/постов.
            setFollow={updateFollowStats} // Функция для обновления состояния подписок/подписчиков/постов.
          />
        </div>
        <p className={styles.bio}>{currentUser.bio}</p> {/* Биография текущего пользователя */}
        {currentUser.bio && currentUser.website && (
         <a
           href={currentUser?.website?.startsWith("http") ? currentUser?.website : `https://${currentUser?.website}`} // Преобразуем в полный URL.
           target="_blank" // Открывать ссылку в новой вкладке.
           rel="noopener noreferrer" // Для безопасности при открытии внешних ссылок.
           className={styles.websiteLink}
         >
          <img src={webIcon} alt="Website" />
          {currentUser.website}
         </a>
        )}

        <div className={styles.divider}>
          {/* Проверка состояния загрузки или ошибок */}
          {loading && <p>{t("loading")}</p>}
          {error && <p>{t("error")}: {error}</p>}

          {/* Отображение постов */}
          {!loading && !error && posts.length > 0 && (
            posts
              .slice()
              .reverse()
              .map((post) => (
                <div key={post._id} className={styles.post}>
                  <Link to={`/post/${post._id}`}>
                    {post.photo ? (
                      <img src={post.photo} alt={`post-${post._id}`} className={styles.postImage} /> 
                    ) : (
                      <p>{t("currentUserProfile.noImage")}</p> 
                    )}
                  </Link>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrenProfile; // Экспорт компонента CurrenProfile по умолчанию.
