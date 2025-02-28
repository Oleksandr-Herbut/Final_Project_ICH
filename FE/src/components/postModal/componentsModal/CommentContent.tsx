import React, { useEffect } from 'react'; // Импортируем React и хук useEffect из библиотеки React.
import { useDispatch, useSelector } from 'react-redux'; // Импортируем хуки useDispatch и useSelector из библиотеки React Redux.
import { FaHeart } from 'react-icons/fa'; // Импортируем иконку сердца из библиотеки react-icons.
import { RootState, AppDispatch } from '../../../store/store'; // Импортируем типы RootState и AppDispatch из файла store.
import { fetchComments, likeComment } from '../../../store/slices/commentSlice'; // Импортируем действия fetchComments и likeComment из commentSlice.
import formatDate from '../../../utils/utils'; // Импортируем функцию formatDate из утилит.
import s from '../postModal.module.css'; // Импортируем стили CSS для компонента.

const CommentContent: React.FC<{ postId: string }> = ({ postId }) => { // Объявляем компонент CommentContent с типизацией.
    const dispatch: AppDispatch = useDispatch(); // Инициализируем dispatch для отправки действий в Redux.
    const comments = useSelector((state: RootState) => state.comments.comments); // Получаем комментарии из состояния Redux.
    const currentUser = useSelector((state: RootState) => state.auth.user); // Получаем текущего пользователя из состояния Redux.
  
    useEffect(() => { // Хук useEffect для выполнения побочных эффектов.
      dispatch(fetchComments(postId)); // Запрос на получение комментариев при монтировании компонента.
    }, [dispatch, postId]); // Выполнение эффекта при изменении dispatch или postId.
  
    useEffect(() => {
      // console.log('Комментарии:', comments); // Логируем комментарии для отладки.
    }, [comments]); // Выполнение эффекта при изменении комментариев.
  
    const handleLikeComment = async (commentId: string) => { // Объявляем асинхронную функцию для обработки лайка комментария.
      if (!currentUser || !currentUser._id) { // Проверка наличия текущего пользователя.
        console.error('User not found'); // Вывод ошибки в консоль, если пользователь не найден.
        return;
      }
      try {
        await dispatch(likeComment({ commentId, userId: currentUser._id })).unwrap(); // Отправка действия likeComment и ожидание завершения.
        dispatch(fetchComments(postId)); // Повторный запрос на получение комментариев.
      } catch (err) {
        console.error('Error liking comment:', err); // Обработка ошибки при лайке комментария.
      }
    };
  
    return (
      <div className={s.commentsSection}>
        {comments.map((comment: any) => { // Итерация по комментариям.
          // console.log('Данные о пользователе:', comment.user); // Логируем данные о пользователе для отладки.

          const user = comment.user || {}; // Получаем данные о пользователе или пустой объект, если пользователь отсутствует.
          return (
            <div key={comment._id} className={s.comment}>
              <img
                src={user.profile_image} // Используем правильное поле для изображения профиля.
                alt={user.username || 'Anonymous'}
                className={s.commentAvatar}
                loading='lazy'
              />
              <div className={s.commentContent}>
                <div className={s.commentHeader}>
                  <p>
                    <strong>{user.username || user.name || 'Anonymous'}</strong> - {comment.content}
                  </p>
                  <p className={s.commentDate}>{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <div className={s.commentActions}>
                <FaHeart
                  className={`${s.likeIcon} ${currentUser && comment.likes?.includes(currentUser._id) ? s.liked : s.unliked}`}
                  onClick={() => handleLikeComment(comment._id)}
                />
                <span className={s.likeCount}>{comment.likes?.length || 0}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

export default CommentContent; // Экспорт компонента CommentContent по умолчанию.
