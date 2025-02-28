import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentPost } from "../../store/slices/postsSlice";
import PostModal from '../../components/postModal/PostModal';
import s from './postPage.module.css';
import { Post as InstancePost } from '../../store/types/instanceTypes';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store/store';

const PostsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  const [selectedPost, setSelectedPost] = useState<InstancePost | null>(null);

  // Получение ID поста из параметров маршрута или состояния
  const postId = useSelector((state: RootState) => state.posts.posts[0]?._id);

  // Используем useEffect для загрузки поста по ID
  useEffect(() => {
    if (postId && !selectedPost) {
      dispatch(fetchCurrentPost(postId));  // Загружаем пост, если его нет в selectedPost
    }
  }, [dispatch, postId, selectedPost]);

  const handleImageClick = (post: InstancePost) => {
    const postId = post._id;

    // Устанавливаем пост в selectedPost, чтобы открыть модалку
    setSelectedPost(post); 

    // Загружаем пост, если он ещё не загружен
    if (!selectedPost || selectedPost._id !== post._id) {
      dispatch(fetchCurrentPost(postId));
    }
  };

  const closeModal = () => {
    setSelectedPost(null); // Закрытие модального окна
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className={s.postList}>
        {posts
          ?.slice()
          .reverse()
          .map((post) => (
            <img
              key={post._id}
              src={post.photo}
              alt="post-thumbnail"
              onClick={() => handleImageClick(post)} // Открытие модалки на клик
              style={{ cursor: 'pointer' }}
            />
          ))}
        
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={closeModal} // Закрытие модального окна
            onUpdatePosts={() => dispatch(fetchCurrentPost(postId))} // Обновление постов
          />
        )}
      </div>
    </div>
  );
};

export default PostsList;
