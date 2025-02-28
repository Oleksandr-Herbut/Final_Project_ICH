import React, { useState } from "react"; // Импортируем React и useState для создания компонента и работы с локальным состоянием.
import { useSelector, useDispatch } from "react-redux"; // Импортируем хуки для работы с Redux.
import { useTranslation } from "react-i18next"; // Импортируем хук для работы с мультиязычностью.
import { setUser } from "../../store/slices/authSlice"; // Импортируем экшен для обновления пользователя в Redux.
import { $api } from "../../api/api"; // Импортируем экземпляр API для отправки запросов.
import CustomButton from "../../components/customButton/CustomButton"; // Импортируем компонент кнопки.
import { RootState } from "../../store/store"; // Импортируем тип состояния приложения.
import styles from "./editProfilePage.module.css"; // Импортируем стили для страницы.
import webIcon from "../../assets/web.svg"; // Импортируем иконку для веб-сайта.
import { logout } from "../../store/slices/authSlice"; // Импортируем экшен для выхода из системы.
import { useNavigate } from "react-router-dom"; // Импортируем хук для навигации.
import { toast } from "react-toastify"; // Импортируем уведомления.
import "react-toastify/dist/ReactToastify.css"; // Импортируем стили для уведомлений.

const EditProfilePage: React.FC = () => { // Создаем функциональный компонент страницы редактирования профиля.
  const { t } = useTranslation(); // Инициализируем хук для перевода.
  const dispatch = useDispatch(); // Инициализируем хук для работы с экшенами Redux.

  // Получаем данные пользователя из Redux.
  const user = useSelector((state: RootState) => state.auth.user);

  // Локальный стейт для формы.
  const [formData, setFormData] = useState<{
    username: string;
    website: string;
    bio: string;
    profileImage: string | File;
  }>({
    username: user?.username || "", // Начальное значение для имени пользователя.
    website: user?.website || "", // Начальное значение для веб-сайта.
    bio: user?.bio || "", // Начальное значение для биографии.
    profileImage: user?.profile_image || "", // Начальное значение для изображения профиля.
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // Локальный стейт для файла изображения.
  const [charCount, setCharCount] = useState(formData.bio.length); // Состояние для подсчета символов в биографии.

  // Обработчик изменения значений текстовых полей.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Обновляем состояние для поля.

    if (name === "bio") {
      setCharCount(value.length); // Если изменяется поле "bio", обновляем счетчик символов.
    }
  };

  const navigate = useNavigate(); // Инициализируем хук для навигации.

  // Обработчик выхода из аккаунта.
  const handleLogoutClick = () => {
    dispatch(logout()); // Вызываем экшен для выхода.
    navigate("/login"); // Перенаправляем на страницу логина.
  };

  // Обработчик изменения изображения профиля.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Получаем файл из выбранного изображения.
    if (file) {
      setProfileImageFile(file); // Сохраняем файл изображения в локальный стейт.
      setFormData((prev) => ({ ...prev, profileImage: file })); // Обновляем локальный стейт для профиля.
    }
  };

  // Обработчик отправки формы.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Останавливаем стандартное поведение формы (перезагрузку страницы).
  
    try {
      if (!user || !user._id) { // Проверяем, если у пользователя нет ID.
        console.error("User ID is missing"); // Выводим ошибку, если ID отсутствует.
        return;
      }
  
      // Создаем объект FormData для отправки данных в формате multipart/form-data.
      const formDataToSend = new FormData();
      formDataToSend.append("userId", user._id); // Добавляем ID пользователя.
      formDataToSend.append("username", formData.username); // Добавляем имя пользователя.
      formDataToSend.append("website", formData.website); // Добавляем веб-сайт.
      formDataToSend.append("bio", formData.bio); // Добавляем биографию.
  
      if (profileImageFile) {
        formDataToSend.append("profile_image", profileImageFile); // Если есть новое изображение, добавляем его.
      }
  
      // Отправляем запрос на сервер с обновленными данными пользователя.
      const response = await $api.put("/users/current", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }, // Указываем, что данные будут отправляться как form-data.
      });
  
      // Обновляем состояние пользователя в Redux.
      dispatch(
        setUser({
          token: localStorage.getItem("token") || "", // Сохраняем токен из localStorage.
          user: response.data, // Обновляем данные пользователя.
        })
      );
  
      // Сохраняем обновленные данные пользователя в localStorage.
      localStorage.setItem("user", JSON.stringify(response.data));
  
      // Показ уведомления о успешном обновлении.
      toast.success("User profile updated successfully", {
        position: "top-center",
        autoClose: 3000, // Уведомление исчезает через 3 секунды.
      });
    } catch (error) {
      console.error("Failed to update user profile:", error); // Логируем ошибку, если не удалось обновить профиль.
      toast.error("Failed to update user profile", {
        position: "top-center", // Показываем уведомление об ошибке.
        autoClose: 3000,
      });
    }
  };
  

  return (
    <form className={styles.form} onSubmit={handleSubmit}> {/* Формируем форму для редактирования профиля. */}
      <h4 className={styles.title}>{t("editProfileForm.edit")}</h4> {/* Заголовок формы, с переводом. */}
      
      <div className={styles.profileSection}>
        <div className={styles.profileInfo}>
        <img
          src={typeof formData.profileImage === "string" ? formData.profileImage : user?.profile_image}
          alt={formData.username || "Profile"}
          className={styles.profileImage}
        />
        <div className={styles.profileDetails}>
          <p className={styles.username}>{formData.username || t("editProfileForm.defaultUsername")}</p> {/* Имя пользователя. */}
          <p className={styles.bio}>{formData.bio || t("editProfileForm.defaultBio")}</p> {/* Биография пользователя. */}
          </div>
        </div>
        
        <div className={styles.uploadWrapper}>
        <label className={styles.uploadLabel}>
          {t("editProfileForm.newPhoto")} {/* Надпись на кнопке для загрузки нового фото. */}
          <input
            type="file"
            style={{ display: "none" }} // Скрываем стандартное поле для загрузки файла.
            onChange={handleImageChange} // Обработчик выбора нового изображения.
            className={styles.hiddenInput} // Класс для скрытого поля.
          />
        </label>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <p className={styles.label}>{t("editProfileForm.username")}</p> {/* Этикетка для поля ввода имени пользователя. */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange} // Обработчик изменения имени пользователя.
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <p className={styles.label}>{t("editProfileForm.website")}</p> {/* Этикетка для поля ввода веб-сайта. */}
        <div className={styles.inputWrapper}>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange} // Обработчик изменения веб-сайта.
          className={styles.input}
        />
        <img src={webIcon} className={styles.icon}></img> {/* Иконка веб-сайта. */}
        </div>
      </div>
           
      <div className={styles.inputGroup}>
        <p className={styles.label}>{t("editProfileForm.about")}</p> {/* Этикетка для поля ввода биографии. */}
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange} // Обработчик изменения биографии.
          className={styles.textarea}
          maxLength={150} // Ограничиваем количество символов в биографии.
        />
        <span className={styles.charCounter}>{`${charCount} / 150`}</span> {/* Показываем количество введенных символов. */}
      </div>

      <div className={styles.buttonGroup}>
        <CustomButton
          text={t("editProfileForm.saveBtn")} // Кнопка "Сохранить".
          type="submit"
          className={styles.saveButton}
          style={{
            width: "168.72px", // Ширина кнопки.
          }}
        />
        <CustomButton
          className={styles.logoutButton}
          text={t("currentUserProfile.btnLogOut")} // Кнопка "Выйти".
          style={{
            width: "168.72px", // Ширина кнопки.
          }}
          onClick={handleLogoutClick} // Обработчик выхода.
        />
      </div>
    </form>
  );
};

export default EditProfilePage; // Экспортируем компонент.
