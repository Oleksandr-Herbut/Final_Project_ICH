// Импортируем необходимые библиотеки и компоненты
import React, { useEffect, useState } from "react"; // Для работы с React и хуками
import { useDispatch, useSelector } from "react-redux"; // Для работы с Redux
import { useParams, useNavigate } from "react-router-dom"; // Для работы с маршрутизацией
import { useTranslation } from "react-i18next"; // Для локализации

import CustomButton from "../../components/customButton/CustomButton"; // Кнопка с настраиваемым текстом и стилями
import FollowsPanel from "../../components/followsPanel/HeaderPanel"; // Панель отображения подписок
import { getUserById } from "../../store/slices/userSlice"; // Действие для получения информации о пользователе
import { fetchOtherUserPosts } from "../../store/slices/postsSlice"; // Действие для получения постов другого пользователя
import { $api } from "../../api/api"; // API для запросов

import webIcon from "../../assets/web.svg"; // Иконка для веб-сайта
import { AppDispatch, RootState } from "../../store/store"; // Типы для Redux
import s from "./otherProfiePage.module.css"; // Стили компонента
import { Link } from "react-router-dom"; // Для создания ссылок на другие страницы

// Тип для данных о подписках (followers, following, posts)
export interface ILocalFollow {
  followers: "Loading..." | number; // Подписчики
  following: "Loading..." | number; // Подписки
  posts: "Loading..." | number; // Количество постов
}

// Тип для элемента подписки
export interface IFollowItem {
  user_id: {
    _id: string;
  };
  follower_user_id: {
    username: string;
    _id: string;
  };
  created_at: Date;
}

// Основной компонент страницы профиля другого пользователя
const CombinedProfile: React.FC = () => {
  const { t } = useTranslation(); // Хук для перевода
  const { userId } = useParams<{ userId: string }>(); // Извлекаем userId из URL
  const navigate = useNavigate(); // Хук для навигации по страницам
  const dispatch = useDispatch<AppDispatch>(); // Для отправки действий в Redux

  // Извлекаем данные из состояния Redux
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { posts, loading: postsLoading, error: postsError } = useSelector(
    (state: RootState) => state.posts
  );
  const { _id } = useSelector((state: RootState) => state.auth.user!); // Текущий пользователь
  const userLoading = useSelector((state: RootState) => state.user.loading); // Загрузка данных пользователя
  const userError = useSelector((state: RootState) => state.user.error); // Ошибка при загрузке данных пользователя
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // Состояние подписки
  const [follow, setFollow] = useState<ILocalFollow>({
    followers: "Loading...",
    following: "Loading...",
    posts: "Loading...",
  }); // Состояние для отображения информации о подписках

  // Проверка на то, что пользователь не видит свой собственный профиль
  useEffect(() => {
    if (_id === userId) {
      navigate("/profile"); // Перенаправляем на страницу текущего пользователя, если ID совпадает
    }
  }, [_id, userId, navigate]);

  // Загружаем информацию о пользователе и проверяем статус подписки
  useEffect(() => {
    if (userId && _id) {
      dispatch(getUserById(userId)); // Получаем информацию о другом пользователе
      dispatch(fetchOtherUserPosts(userId)); // Загружаем посты пользователя

      // Функция для проверки, подписан ли текущий пользователь на другого
      const checkFollowingStatus = async () => {
        try {
          if (!userId || !userId.trim()) {
            console.error("userId is invalid or empty");
            return;
          }

          const response = await $api.get(`/follows/${_id}/isFollowing/${userId}`);
          if (response.data && typeof response.data.isFollowing !== 'undefined') {
            setIsFollowing(response.data.isFollowing); // Обновляем состояние подписки
          } else {
            console.error('Unexpected response format:', response.data);
          }
        } catch (error: any) {
          console.error("Error checking following status:", error);
        }
      };

      checkFollowingStatus(); // Вызовем проверку подписки
    } else {
      console.error("Invalid userId or _id", userId, _id);
    }
  }, [dispatch, userId, _id]);

  // Функция для изменения состояния подписки
  const handleChangeFollow = (newFollow: ILocalFollow | ((prev: ILocalFollow) => ILocalFollow)) => {
    setFollow(newFollow);
  };

  // Функция для подписки
  const handleFollow = async () => {
    try {
      const response = await $api.post(`/follows/${_id}/follow/${userId}`);
  
      if (response.status === 201) {
        setIsFollowing(true); // Подписка успешна
        setFollow((prev) => ({
          ...prev,
          followers: typeof prev.followers === "number" ? prev.followers + 1 : 1,
        }));
      } else if (response.data.isFollowing) {
        setIsFollowing(true); // Если уже подписан, обновляем состояние
        setFollow((prev) => ({
          ...prev,
          followers: typeof prev.followers === "number" ? prev.followers + 1 : 1,
        }));
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.message === "You are already following this user") {
        setIsFollowing(true); // Уже подписан, обновляем состояние
        setFollow((prev) => ({
          ...prev,
          followers: typeof prev.followers === "number" ? prev.followers + 1 : 1,
        }));
      } else {
        console.error("Error following user:", error);
      }
    }
  };

  // Функция для отписки
  const handleUnfollow = async () => {
    try {
      const response = await $api.delete(`/follows/${_id}/unfollow/${userId}`);
      
      if (response.status === 200) {
        setIsFollowing(false); // Отписка успешна
        setFollow((prev) => ({
          ...prev,
          followers: typeof prev.followers === "number" ? prev.followers - 1 : 0,
        }));
      }
    } catch (error: any) {
      if (error.response?.status === 404 && error.response.data?.message === "You are not following this user") {
        setIsFollowing(false); // Уже отписан, обновляем состояние
      } else {
        console.error("Error unfollowing user:", error);
      }
    }
  };

  // Функция для перехода к сообщениям
  const handleMessage = () => {
    navigate("/messages", { state: { targetUserId: userId } });
  };

  // Загружаем сообщение, если данные еще не получены
  if (userLoading || postsLoading) return <p>{t("loading")}</p>;

  // Выводим ошибку, если не удалось загрузить данные
  if (userError) return <p>{t("error")}: {userError}</p>;
  if (postsError) return <p>{t("error")}: {postsError}</p>;

  return (
    <>
      {currentUser ? (
        // Если данные о текущем пользователе загружены, отображаем профиль
        <div className={s.userProfile}>
          {/* Отображение аватара */}
          <div className={s.avatarWrapper}>
            <div className={s.avatarInner}>
              <img
                src={currentUser.profile_image}
                alt={currentUser.username}
                className={s.avatar}
              />
            </div>
          </div>

          <div className={s.userDetails}>
            <div className={s.actionButtons}>
              <p className={s.username}>{currentUser.username}</p>
              {/* Кнопка для подписки/отписки */}
              <CustomButton
                className={s.button}
                text={isFollowing ? t("otherProfile.unfollow") : t("otherProfile.follow")}
                style={{  width: "168px" }}
                onClick={isFollowing ? handleUnfollow : handleFollow}
              />
              {/* Кнопка для перехода в сообщения */}
              <CustomButton
                text={t("otherProfile.message")}
                style={{ width: "168px" }}
                onClick={handleMessage}
                className={s.messageButton}
              />
            </div>

            <div className={s.stats}>
              <FollowsPanel
                userId={userId || ""}
                follow={follow}
                setFollow={handleChangeFollow}
              />
            </div>
            <p className={s.bio}>{currentUser.bio}</p>
            {/* Ссылка на веб-сайт пользователя, если он есть */}
            {currentUser.website && (
              <a
                href={currentUser.website}
                className={s.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={webIcon} alt="Website" />
                {currentUser.website}
              </a>
            )}
            {/* Раздел с постами */}
            <div className={s.divider}>
              {!postsLoading && !postsError && posts && posts.length > 0 && (
                posts
                  .slice() // Переворачиваем посты
                  .reverse()
                  .map((post) => (
                    <div key={post._id} className={s.post}>
                      <Link to={`/post/${post._id}`}>
                        {post.photo ? (
                          <img
                            src={post.photo}
                            alt={`post-${post._id}`}
                            className={s.postImage}
                          />
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
      ) : (
        // Если пользователь не найден
        <p>{t("userNotFound")}</p>
      )}
    </>
  );
};

export default CombinedProfile;
