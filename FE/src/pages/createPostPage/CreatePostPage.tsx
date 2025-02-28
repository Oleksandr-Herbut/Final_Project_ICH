import { useState, FormEvent, ChangeEvent } from "react"; // Импортируем хуки useState, FormEvent и ChangeEvent из библиотеки React.
import { useSelector } from "react-redux"; // Импортируем хук useSelector из библиотеки React Redux.
import { RootState } from "../../store/store"; // Импортируем тип RootState из файла store.
import { toast } from "react-toastify"; // Импортируем Toast из библиотеки react-toastify.
import "react-toastify/dist/ReactToastify.css"; // Импортируем стили для Toast.
import styles from "./createPostPage.module.css"; // Импортируем стили CSS для компонента.
import { $api } from "../../api/api"; // Импортируем объект $api для взаимодействия с API.

interface ImageFormProps { // Интерфейс для пропсов компонента CreatePostPage.
  onClose: () => void; // Функция для закрытия модального окна.
}

export const CreatePostPage: React.FC<ImageFormProps> = ({ onClose }) => { // Объявляем компонент CreatePostPage с типизацией.
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Хук состояния для выбранного файла.
  const [previewUrl, setPreviewUrl] = useState(""); // Хук состояния для URL превью изображения.
  const [caption, setCaption] = useState(""); // Хук состояния для заголовка поста.
  const [isEmojiVisible, setIsEmojiVisible] = useState(false); // Хук состояния для отображения эмодзи.
  const [uploading, setUploading] = useState(false); // Хук состояния для загрузки.
  const charCount = caption.length; // Подсчет количества символов в заголовке.

  const emojiList = [
    ...Array.from({ length: 300 }, (_, i) => String.fromCodePoint(0x1f600 + i)), // Расширяет текущий набор эмодзи.
    ...Array.from({ length: 20 }, (_, i) => String.fromCodePoint(0x2700 + i)), // Добавляет другие эмодзи (символы).
    ...Array.from({ length: 20 }, (_, i) => String.fromCodePoint(0x1f300 + i)), // Добавляет больше эмодзи (погода и т.п.).
    ...Array.from({ length: 20 }, (_, i) => String.fromCodePoint(0x1f600 + i)), // Добавляет ещё эмодзи.
    // Вы можете продолжать добавлять другие диапазоны или конкретные эмодзи по мере необходимости.
  ];

  const currentUser = useSelector((state: RootState) => state.auth.user); // Получаем текущего пользователя из состояния Redux.

  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => { // Функция для обработки выбора файла.
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFormSubmit = async (e: FormEvent) => { // Функция для обработки отправки формы.
    e.preventDefault();

    if (!selectedFile && !previewUrl) {
      toast.error("Please upload an image or provide a URL");
      return;
    }

    if (!currentUser) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else {
      formData.append("photo", previewUrl);
    }
    formData.append("content", caption.trim());
    formData.append("userId", currentUser._id);

    setUploading(true);
    toast.info("Uploading...");

    try {
      const response = await $api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPreviewUrl(response.data.post.photo);
      toast.success("Post uploaded successfully!");

      setCaption("");
      setSelectedFile(null);
      setPreviewUrl("");
      setUploading(false);

      setTimeout(onClose, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Try again.");
      setUploading(false);
    }
  };

  const toggleEmojiPicker = () => { // Функция для отображения списка эмодзи.
    setIsEmojiVisible((prev) => !prev);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => { // Функция для обработки клика по оверлею.
    if ((e.target as HTMLDivElement).classList.contains(styles.modal)) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}> {/* Модальное окно */}
      <form onSubmit={handleFormSubmit} className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create new post</h1>
          <button type="submit" className={styles.submitButton} disabled={uploading}>
            {uploading ? "Uploading..." : "Share"}
          </button>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.fileInputContainer}>
            <label htmlFor="fileInput" className={styles.uploadLabel}>
              <img src={previewUrl || "/src/assets/place-create.svg"} alt="Preview" className={styles.uploadIcon} /> {/* Превью изображения */}
            </label>
            <input id="fileInput" type="file" accept="image/*" className={styles.fileInput} onChange={handleFileSelection} /> {/* Ввод файла */}
          </div>

          <div className={styles.detailsSection}>
            {currentUser && (
              <div className={styles.userInfo}>
                <span className={styles.placeholderImg}>
                  <img src={currentUser.profile_image} alt={currentUser.username} className={styles.userAvatar} /> {/* Аватар пользователя */}
                </span>
                <span className={styles.username}>{currentUser.username}</span>
              </div>
            )}

            <textarea
              placeholder="Describe your post"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className={styles.textArea}
            />
            <span className={styles.charCounter}>{`${charCount} / 150`}</span> {/* Счетчик символов */}

            <div className={styles.emojiContainer}>
              <button type="button" className={styles.emojiButton} onClick={toggleEmojiPicker}>
                😊
              </button>
              {isEmojiVisible && (
                <div className={styles.emojiList}>
                  {emojiList.map((emoji, index) => ( // Список эмодзи.
                    <span key={index} className={styles.emojiItem} onClick={() => setCaption((prev) => prev + emoji)}>
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
