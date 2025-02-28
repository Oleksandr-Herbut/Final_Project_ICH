import React, { useEffect, useRef, useState } from "react"; // Импортируем React и необходимые хуки для состояния и побочных эффектов
import { Link, useLocation } from "react-router-dom"; // Импортируем компоненты для навигации с использованием react-router
import {
  fetchFollowedPosts,
  likePost,
  unlikePost,
  followUser,
  unfollowUser,
} from "../../utils/apiCalls"; // Импортируем функции для работы с API (загрузка постов, лайки, подписка и отписка)
import { checkFollowingStatus } from "../../utils/apiCalls"; // Функция для проверки статуса подписки на пользователя
import styles from "./HomePage.module.css"; // Импортируем стили для страницы
import done from "../../assets/done.png"; // Изображение для отображения сообщения о завершении загрузки
import like from "../../assets/reactions/like.svg"; // Изображение для иконки лайка
import liked from "../../assets/reactions/liked.svg"; // Изображение для иконки лайка, когда пост уже лайкнут
import comment from "../../assets/reactions/comment.svg"; // Иконка комментариев
import { formatDate } from "../../utils/utils"; // Функция для форматирования даты
import { Post } from "../../store/types/instanceTypes"; // Тип для поста
import PostModal from "../../components/postModal/PostModal"; // Модальное окно для отображения поста

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // Состояние для хранения списка постов
  const [page] = useState(1); // Состояние для текущей страницы (для пагинации)
  const [hasMore, setHasMore] = useState(true); // Состояние для проверки, есть ли еще посты для загрузки
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Ссылка для элемента загрузки дополнительных постов
  const location = useLocation(); // Получаем текущий путь в URL (для передачи в state при навигации)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // Получаем данные текущего пользователя из localStorage
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Состояние для хранения выбранного поста (для модального окна)
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления видимостью модального окна

  const handlePostClick = (post: Post) => {
    setSelectedPost(post); // Устанавливаем выбранный пост в состояние
    setIsModalOpen(true); // Открываем модальное окно
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };

  useEffect(() => { // Хук useEffect для загрузки постов при монтировании компонента и обновлении страницы
    const loadPosts = async (): Promise<void> => {
      try {
        const result = await fetchFollowedPosts(page); // Загружаем посты для текущей страницы
        if (result && Array.isArray(result.posts)) { // Проверка, что полученные данные — это массив постов
          const updatedPosts = await Promise.all(
            result.posts.map(async (post: Post) => {
              const isFollowed = await checkFollowingStatus(currentUser._id, post.author._id); // Проверка статуса подписки на автора поста
              return {
                ...post,
                author: {
                  ...post.author,
                  is_followed: isFollowed, // Добавляем поле is_followed в автора
                },
              };
            })
          );

          // Обновляем список постов, избегая дублирования
          setPosts((prevPosts) => {
            const newPosts: Post[] = updatedPosts.filter(
              (newPost: Post) => !prevPosts.some((post: Post) => post._id === newPost._id)
            );
            return [...prevPosts, ...newPosts]; // Объединяем старые и новые посты
          });

          if (result.posts.length < 10) setHasMore(false); // Если постов меньше 10, скрываем кнопку загрузки
        } else {
          console.error("Invalid data format received:", result); // Ошибка, если данные не соответствуют ожиданиям
        }
      } catch (error) {
        console.error("Error fetching posts:", error); // Обработка ошибок при загрузке постов
      }
    };

    loadPosts(); // Вызов функции загрузки постов
  }, [page]); // Зависимость от страницы, чтобы перезагружать посты при смене страницы

  const handleFollow = async (userId: string, targetUserId: string, isFollowed: boolean): Promise<void> => {
    try {
      if (isFollowed) {
        await unfollowUser(userId, targetUserId); // Если уже подписан, отписываем
      } else {
        await followUser(userId, targetUserId); // Если не подписан, подписываем
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.author._id === targetUserId
            ? { ...post, author: { ...post.author, is_followed: !isFollowed } }
            : post
        )
      ); // Обновляем список постов с новым статусом подписки
    } catch (err) {
      console.error("Error while following/unfollowing user:", err); // Обработка ошибок при подписке
    }
  };

  // Обработчик лайка
  const handleLike = async (postId: string, isLiked: boolean): Promise<void> => {
    try {
      const userId = currentUser._id; // Получаем ID текущего пользователя
      if (isLiked) {
        await unlikePost(postId, userId); // Если лайкнут, убираем лайк
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, liked_by_user: false, like_count: post.like_count - 1 } // Уменьшаем счетчик лайков
              : post
          )
        );
      } else {
        await likePost(postId, userId); // Если не лайкнут, ставим лайк
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, liked_by_user: true, like_count: post.like_count + 1 } // Увеличиваем счетчик лайков
              : post
          )
        );
      }
    } catch (err) {
      console.error("Error while liking/unliking post:", err); // Обработка ошибок при лайке/анлайке
    }
  };

  return (
    <div className={styles.postsContainer}>
      {posts.map((post) => ( // Отображаем каждый пост
        <div key={post._id} className={styles.post}>
          <div className={styles.header}>
            <Link to={`/profile/${post.author._id}`} className={styles.profile}>
              <img src={post.author.profile_image} alt={post.author.username} className={styles.profileImage} />
              <div className={styles.info}>
                <p className={styles.username}>{post.author.username}</p>
                <p className={styles.date}>{formatDate(post.createdAt?.toString() ?? '')}</p>
              </div>
            </Link>
            {currentUser._id !== post.author._id && (
              <button
                className={styles.followButton}
                onClick={() => handleFollow(currentUser?._id, post.author._id, post.author.is_followed)}
              >
                {post.author.is_followed ? "unfollow" : "follow"}
              </button>
            )}
          </div>
          <Link onClick={() => handlePostClick(post)} to={`/post/${post._id}`} state={{ backgroundLocation: location }}>
            <img src={post.photo} alt={`post-${post._id}`} className={styles.postImage} />
          </Link>
          <div className={styles.actions}>
            <div className={styles.actionsIcons}>
              <img
                src={post.liked_by_user ? liked : like}
                alt="like"
                className={styles.actionsIcon}
                onClick={() => handleLike(post._id, post.liked_by_user)}
              />
              <img src={comment} alt="comment" className={styles.actionsIcon}></img>
            </div>
            <p className={styles.likes}>{post.like_count} likes</p>
            <p className={styles.content}>
              <strong>{post.author.username}</strong> {post.content}
            </p>
            <p className={styles.comments}>View all comments ({post.comments_count})</p>
          </div>
        </div>
      ))}
      <div ref={loadMoreRef} className={styles.loadMoreTrigger}></div>
      {!hasMore && (
        <div className={styles.endMessageContainer}>
          <img src={done} alt="done" className={styles.doneImage} />
          <p>You've seen all the posts</p>
          <p className={styles.subMessage}>You have viewed all new publications</p>
        </div>
      )}
      {isModalOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={handleCloseModal}
          onUpdatePosts={() => {}}
        />
      )}
    </div>
  );
};

export default HomePage;
