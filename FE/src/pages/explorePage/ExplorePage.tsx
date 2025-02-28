import React, { useEffect, useState } from 'react'; // Импорт React и хук useState и useEffect для управления состоянием и побочными эффектами
import { useDispatch, useSelector } from 'react-redux'; // Импорт хуков для работы с Redux
import { fetchAllPublicPosts } from '../../store/slices/postsSlice'; // Импорт экшена для загрузки постов
import { RootState, AppDispatch } from '../../store/store'; // Импорт типов для типов состояния и диспатча из Redux
import PostModal from '../../components/postModal/PostModal'; // Импорт компонента модального окна для отображения поста
import styles from './explorePage.module.css'; // Импорт CSS модульных стилей для страницы Explore

// Интерфейс для типа данных поста
interface PostProps {
  _id: string; // Уникальный идентификатор поста
  photo: string; // URL фотографии поста
  caption?: string; // Описание/текст к посту (необязательное поле)
}

const ExplorePage: React.FC = () => { // Основной компонент страницы Explore
  const dispatch = useDispatch<AppDispatch>(); // Диспетчер для отправки экшенов в Redux
  const { posts, loading } = useSelector((state: RootState) => state.posts); // Получаем список постов и состояние загрузки из Redux

  const [activePost, setActivePost] = useState<PostProps | null>(null); // Состояние для хранения выбранного поста для отображения в модальном окне
  const [modalVisible, setModalVisible] = useState(false); // Состояние для управления видимостью модального окна

  useEffect(() => { // Эффект, который срабатывает при монтировании компонента
    dispatch(fetchAllPublicPosts()); // Отправляем экшен для загрузки всех публичных постов
  }, [dispatch]); // Пустой массив зависимостей, чтобы эффект сработал только при монтировании компонента

  // Функция для перемешивания массива постов
  const shuffleArray = (array: PostProps[]) => { // Функция принимает массив постов
    for (let i = array.length - 1; i > 0; i--) { // Цикл от конца массива до первого
      const j = Math.floor(Math.random() * (i + 1)); // Генерация случайного индекса
      [array[i], array[j]] = [array[j], array[i]]; // Обмен элементов в массиве
    }
    return array; // Возвращаем перемешанный массив
  };

  const shuffledPosts = shuffleArray([...posts]); // Создаем копию массива постов и перемешиваем его

  const openModal = (post: PostProps) => { // Открытие модального окна с выбранным постом
    setActivePost(post); // Устанавливаем выбранный пост в состояние
    setModalVisible(true); // Делаем модальное окно видимым
  };

  const closeModal = () => { // Закрытие модального окна
    setActivePost(null); // Очищаем выбранный пост
    setModalVisible(false); // Скрываем модальное окно
  };

  if (loading) return <div>Loading...</div>; // Если идет загрузка данных, показываем текст "Loading..."

  // Основная разметка страницы
  return (
    <div className={styles.container}> {/* Контейнер для всей страницы */}
      <section className={styles.galleryWrapper}> {/* Обертка для галереи изображений */}
        <div className={styles.galleryGrid}> {/* Сетка галереи для отображения постов */}
          {shuffledPosts.map((post: PostProps, idx: number) => ( // Маппим перемешанные посты на экран
            <div
              key={post._id} // Уникальный ключ для каждого элемента
              className={`${styles.galleryItem} ${idx % 3 === 0 ? styles.featured : ''}`} // Применение стилей для каждого поста (и для некоторых - дополнительный стиль featured)
              onClick={() => openModal(post)} // Обработчик клика, чтобы открыть модальное окно с постом
            >
              <img
                src={post.photo} // URL изображения поста
                alt={post.caption || 'Post image'} // Альтернативный текст (если нет подписи, показываем "Post image")
                className={styles.image} // Применение стилей для изображения
              />
            </div>
          ))}
        </div>
      </section>

      {/* Если модальное окно открыто, показываем компонент PostModal */}
      {modalVisible && activePost && (
        <PostModal post={activePost} isVisible={modalVisible} onClose={closeModal} />
      )}
    </div>
  );
};

export default ExplorePage; // Экспорт компонента ExplorePage
