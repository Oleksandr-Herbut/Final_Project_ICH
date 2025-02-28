import React, { useState, useEffect } from 'react'; // Импортируем React и хуки useState и useEffect для работы с состоянием и побочными эффектами.
import { useDispatch, useSelector } from 'react-redux'; // Импортируем хуки useDispatch и useSelector для работы с Redux.
import { FaEllipsisV } from 'react-icons/fa'; // Импортируем иконку "три точки" из библиотеки react-icons.
import { RootState, AppDispatch } from '../../store/store'; // Импортируем типы RootState и AppDispatch для типизации Redux.
import { $api } from "../../api/api"; // Импортируем объект $api для взаимодействия с сервером через API.
import { addComment } from '../../store/slices/commentSlice'; // Импортируем экшн addComment для добавления комментариев в Redux.
import EmojiPicker from './componentsModal/EmojiPiker'; // Импортируем компонент EmojiPicker для выбора эмодзи.
import CommentContent from './componentsModal/CommentContent'; // Импортируем компонент CommentContent для отображения комментариев.
import s from './PostModal.module.css'; // Импортируем стили для модального окна.
import { Post } from '../../store/types/instanceTypes'; // Импортируем тип Post для типизации данных поста.
import commbtn from "../../assets/comment_btn.svg"; // Импортируем иконку кнопки комментариев.
import heart from "../../assets/heart_btn.svg"; // Импортируем иконку кнопки лайков.
import { Link } from 'react-router-dom'; // Импортируем компонент Link для создания ссылок между страницами.
import { toast } from 'react-toastify'; // Импортируем функцию toast для отображения уведомлений.
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили для toast уведомлений.

interface ModalProps { // Интерфейс для пропсов компонента PostModal.
    post: Post; // Объект поста.
    onClose: () => void; // Функция для закрытия модального окна.
    onUpdatePosts: () => void; // Функция для обновления списка постов.
}

const PostModal: React.FC<ModalProps> = ({ post, onClose, onUpdatePosts = () => {} }) => { 
    const dispatch: AppDispatch = useDispatch(); // Получаем dispatch для отправки экшенов в Redux.
    const currentUser = useSelector((state: RootState) => state.auth.user); // Получаем текущего пользователя из состояния Redux.
    const [newComment, setNewComment] = useState(''); // Хук состояния для нового комментария.
    const [error, setError] = useState<string | null>(null); // Хук состояния для хранения ошибок.
    const [showMenu, setShowMenu] = useState(false); // Хук состояния для отображения меню опций.
    const [likes, setLikes] = useState(post.like_count || 0); // Хук состояния для количества лайков поста.
    const [comments, setComments] = useState(post.comments_count || 0); // Хук состояния для количества комментариев поста.
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false); // Хук состояния для подтверждения удаления поста.
    const [isEditing, setIsEditing] = useState(false); // Хук состояния для отображения режима редактирования.
    const [editedCaption, setEditedCaption] = useState(post.content); // Хук состояния для редактируемого контента поста.
    const [editedImage, setEditedImage] = useState(post.photo); // Хук состояния для редактируемого изображения поста.

    useEffect(() => {
        setLikes(post.like_count || 0); // Обновляем количество лайков, когда пост обновляется.
        setComments(post.comments_count || 0); // Обновляем количество комментариев, когда пост обновляется.
    }, [post]); // Зависимость от post: эффекты сработают, когда пост изменится.

    const handleAddComment = async () => { // Функция для добавления нового комментария.
        if (!currentUser?._id) { // Проверка, существует ли текущий пользователь.
            setError('User not found'); // Если пользователь не найден, выводим ошибку.
            return;
        }

        try {
            // Отправляем запрос на добавление комментария с помощью Redux экшн.
            await dispatch(addComment({ postId: post._id, userId: currentUser._id, content: newComment.trim(), profile_image: currentUser.profile_image }));
            setNewComment(''); // Очищаем поле ввода комментария.
            setComments((prev) => prev + 1); // Увеличиваем количество комментариев на 1.
        } catch {
            setError('Failed to add comment'); // Если произошла ошибка, выводим сообщение об ошибке.
        }
    };

    const handleLike = async () => { // Функция для обработки лайка.
        if (!currentUser?._id) { // Проверка, существует ли текущий пользователь.
            setError('User not found'); // Если пользователь не найден, выводим ошибку.
            return;
        }

        try {
            // Отправляем запрос на добавление лайка.
            await $api.post(`/likes/${post._id}/${currentUser._id}, { userId: currentUser._id }`);
            setLikes((prev) => prev + 1); // Увеличиваем количество лайков на 1.
        } catch (err) {
            console.error("Like error:", err); // Логируем ошибку, если не удалось добавить лайк.
        }
    };

    const handleDelete = async () => { // Функция для удаления поста.
        try {
            await $api.delete(`/posts/${post._id}`); // Отправляем запрос на удаление поста.
            onUpdatePosts(); // Обновляем список постов.
            onClose(); // Закрываем модальное окно.
            toast.success("Post deleted successfully!"); // Показываем уведомление об успешном удалении.
        } catch (err) {
            console.error("Delete error:", err); // Логируем ошибку, если не удалось удалить пост.
        }
    };

    const handleEditSave = async () => { // Функция для сохранения изменений поста.
        if (!editedCaption.trim()) { // Проверка на пустой контент.
            alert("Content cannot be empty!"); // Если контент пустой, показываем предупреждение.
            return;
        }

        try {
            // Отправляем запрос на обновление поста с новым контентом и изображением.
            await $api.put(`/posts/${post._id}`, { content: editedCaption, image_url: editedImage });
            setIsEditing(false); // Выключаем режим редактирования.
            onUpdatePosts(); // Обновляем список постов.
            toast.success("Post updated successfully!"); // Показываем уведомление об успешном обновлении.
        } catch (err) {
            console.error("Edit error:", err); // Логируем ошибку, если не удалось обновить пост.
        }
    };

    const handleCopyLink = () => { // Функция для копирования ссылки на пост.
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`); // Копируем ссылку в буфер обмена.
        toast.info("Post link copied!"); // Показываем уведомление о том, что ссылка скопирована.
    };

    return (
        <div className={s.modalOverlay} onClick={onClose}> {/* Обертка для модального окна, закрывается при клике на фоновую область. */}
            <div className={s.modalContent} onClick={(e) => e.stopPropagation()}> {/* Основной контент модального окна. */}
                <div className={s.leftSide}> {/* Левая сторона модального окна. */}
                    <img src={post.photo} alt="post" className={s.postImage} /> {/* Изображение поста. */}
                </div>

                <div className={s.rightSide}> {/* Правая сторона модального окна. */}
                    <div className={s.userInfo}> {/* Блок с информацией о пользователе. */}
                        <img src={post.author.profile_image} alt="profile" className={s.profileImage} loading='lazy' /> {/* Изображение профиля автора. */}
                        <Link className={s.link} to={`/profile/${post.author._id}`}> {/* Ссылка на профиль пользователя. */}
                            <span className={s.userName}>{post.author.username}</span> {/* Имя пользователя. */}
                        </Link>
                        <button className={s.optionsButton} onClick={() => setShowMenu((prev) => !prev)}> {/* Кнопка для показа/скрытия меню опций. */}
                            <FaEllipsisV />
                        </button>
                    </div>

                    {showMenu && ( // Если меню опций открыто, показываем его.
                        <div className={s.menu}> 
                            <button className={s.menuItem} onClick={() => setIsDeleteConfirm(true)}>Delete</button> {/* Кнопка для удаления поста. */}
                            <button className={s.menuItem} onClick={() => setIsEditing(true)}>Edit</button> {/* Кнопка для редактирования поста. */}
                            <button className={s.menuItem} onClick={handleCopyLink}>Copy link</button> {/* Кнопка для копирования ссылки. */}
                            <button className={s.menuItem} onClick={() => setShowMenu(false)}>Cancel</button> {/* Кнопка для отмены меню. */}
                        </div>
                    )}

                    {isDeleteConfirm && ( // Если требуется подтверждение удаления, показываем это окно.
                        <div className={s.confirmBox}> 
                            <p>Are you sure?</p>
                            <button className={s.confirmButton} onClick={handleDelete}>Yes</button> {/* Кнопка для подтверждения удаления. */}
                            <button className={s.cancelButton} onClick={() => setIsDeleteConfirm(false)}>No</button> {/* Кнопка для отмены удаления. */}
                        </div>
                    )}

                    {isEditing ? ( // Если режим редактирования активирован, отображаем форму редактирования.
                        <div className={s.editBox}>
                            {editedImage && <img src={editedImage} alt="Preview" className={s.preview} />} {/* Превью измененного изображения. */}
                            <input type="file" accept="image/*" onChange={(e) => { // Обработчик изменения изображения.
                                if (e.target.files?.[0]) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setEditedImage(reader.result as string); // Устанавливаем новое изображение.
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }} />
                            <textarea className={s.editCaption} value={editedCaption} onChange={(e) => setEditedCaption(e.target.value)} /> {/* Редактируемый текст поста. */}
                            <div className={s.editButtons}> 
                                <button className={s.saveButton} onClick={handleEditSave}>Save</button> {/* Кнопка сохранения изменений. */}
                                <button className={s.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button> {/* Кнопка для отмены редактирования. */}
                            </div>
                        </div>
                    ) : (
                        <p className={s.caption}>{post.content}</p> 
                    )}

                    <CommentContent postId={post._id} /> {/* Компонент для отображения комментариев. */}

                    <div className={s.actions}> {/* Блок с действиями: лайк и комментарии. */}
                        <span><img src={commbtn} alt="" /> {comments} </span> {/* Количество комментариев. */}
                        <span><img src={heart} alt="" onClick={handleLike} /> {likes} </span> {/* Кнопка лайка и количество лайков. */}
                    </div>

                    <div className={s.addComment}> {/* Блок для добавления комментария. */}
                        <EmojiPicker onSelectEmoji={(emoji) => setNewComment((prev) => prev + emoji)} /> {/* Компонент для выбора эмодзи. */}
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)} // Обработчик изменения комментария.
                            placeholder="Add a comment..."
                            className={s.commentInput}
                        />
                        <button className={s.submitButton} onClick={handleAddComment} disabled={!newComment.trim()}>Submit</button> {/* Кнопка отправки комментария. */}
                    </div>
                    {error && <p>{error}</p>} {/* Если есть ошибка, отображаем её. */}
                </div>
            </div>
        </div>
    );
};

export default PostModal; // Экспортируем компонент PostModal для использования в других частях приложения.
