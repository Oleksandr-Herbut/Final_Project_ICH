import { useState } from "react"; // Импортируем хук useState из библиотеки React.
import { Link } from "react-router-dom"; // Импортируем компонент Link из библиотеки react-router-dom.
import { useTranslation } from "react-i18next"; // Импортируем хук useTranslation из библиотеки i18next для перевода.
import { $api } from "../../api/api"; // Импортируем объект $api для взаимодействия с API.
import styles from "./resetForm.module.css"; // Импортируем модульные стили CSS для компонента.
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"; // Импортируем иконки глаз из библиотеки react-icons.
import trouble from "../../assets/trouble_logging _in.svg"; // Импортируем изображение.
import CustomButton from "../customButton/CustomButton"; // Импортируем компонент CustomButton.
import logo from "../../assets/logo-ichgram.svg"; // Импортируем логотип.
import { ToastContainer, toast } from "react-toastify"; // Импортируем Toast и контейнер для Toast из библиотеки react-toastify.
import "react-toastify/dist/ReactToastify.css"; // Импортируем стили для Toast.

export const ResetForm = () => { // Объявляем компонент ResetForm.
  const { t } = useTranslation(); // Используем хук useTranslation для перевода.

  const [userObj, setUserObj] = useState({ email: "", oldPassword: "", newPassword: "" }); // Хук состояния для объекта пользователя.
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false }); // Хук состояния для отображения паролей.
  const [error, setError] = useState(""); // Хук состояния для ошибки.
  const [isPasswordReset, setIsPasswordReset] = useState(false); // Хук состояния для проверки сброса пароля.

  interface UserObj { // Интерфейс для объекта пользователя.
    email: string;
    oldPassword: string;
    newPassword: string;
  }

  const handleInputChange = (field: keyof UserObj) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserObj((prev) => ({ ...prev, [field]: e.target.value }));
  }; // Функция для обработки изменений в полях ввода.

  interface CheckUserResponse { // Интерфейс для ответа при проверке пользователя.
    status: number;
  }

  const handleCheckUser = async (e: React.FormEvent<HTMLFormElement>) => { // Функция для обработки проверки пользователя.
    e.preventDefault();
    setError("");
    try {
      const response: CheckUserResponse = await $api.post("/auth/check-user", { email: userObj.email });
      if (response.status === 200) {
        setIsPasswordReset(true);
        // toast.success(t("resetForm.userFound"));
      } else {
        setError(t("resetForm.userNotFound"));
        toast.error(t("resetForm.userNotFound"));
      }
    } catch (error) {
      console.error("Ошибка при проверке пользователя:", error);
      setError(t("resetForm.checkError"));
      toast.error(t("resetForm.checkError"));
    }
  };

  interface UpdatePasswordResponse { // Интерфейс для ответа при обновлении пароля.
    status: number;
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => { // Функция для обработки обновления пароля.
    e.preventDefault();
    setError("");
    try {
      const response: UpdatePasswordResponse = await $api.post("/auth/update-password", {
        email: userObj.email,
        oldPassword: userObj.oldPassword,
        newPassword: userObj.newPassword,
      });
      if (response.status === 200) {
        toast.success(t("resetForm.passwordUpdated"));
        setIsPasswordReset(false);
        setUserObj({ email: "", oldPassword: "", newPassword: "" });
      } else {
        setError(t("resetForm.updateError"));
        toast.error(t("resetForm.updateError"));
      }
    } catch (error) {
      console.error("Ошибка при обновлении пароля:", error);
      setError(t("resetForm.updateError"));
      toast.error(t("resetForm.updateError"));
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> {/* Контейнер для уведомлений */}
      <Link to={"/"}>
        <img src={logo} alt="logo" className={styles.resetLogo} /> {/* Логотип */}
      </Link>
      <hr style={{ color: "var(--color-text-grey)", opacity: "0.4" }} />
      <div className={styles.resetFormBox}>
        <form
          className={styles.resetForm}
          onSubmit={isPasswordReset ? handleUpdatePassword : handleCheckUser} // Вызов функции для проверки пользователя или обновления пароля.
        >
          <img src={trouble} alt="logo" /> {/* Изображение */}
          <h5>{t("resetForm.trouble")}</h5> {/* Заголовок */}
          <p className={styles.instruction}>{t("resetForm.instruction")}</p> {/* Инструкция */}

          <input
            placeholder={t("resetForm.placeholderEmail")}
            value={userObj.email}
            onChange={handleInputChange("email")}
            type="email"
            style={{
              paddingLeft: "8px",
              backgroundColor: "var(--color-bg-light-grey)",
              color: "var(--color-text-grey)",
            }}
          />

          {isPasswordReset && (
            <>
              <div className={styles.passwordContainer}>
                <input
                  placeholder={t("resetForm.placeholderOldPassword")}
                  value={userObj.oldPassword}
                  onChange={handleInputChange("oldPassword")}
                  type={showPasswords.old ? "text" : "password"}
                  style={{
                    paddingLeft: "8px",
                    backgroundColor: "var(--color-bg-light-grey)",
                    color: "var(--color-text-grey)",
                    marginTop: "6px",
                  }}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, old: !prev.old }))
                  }
                >
                  {showPasswords.old ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </span>
              </div>

              <div className={styles.passwordContainer}>
                <input
                  placeholder={t("resetForm.placeholderNewPassword")}
                  value={userObj.newPassword}
                  onChange={handleInputChange("newPassword")}
                  type={showPasswords.new ? "text" : "password"}
                  style={{
                    paddingLeft: "8px",
                    backgroundColor: "var(--color-bg-light-grey)",
                    color: "var(--color-text-grey)",
                    marginTop: "6px",
                  }}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </span>
              </div>
            </>
          )}

          {error && <p className={styles.errorMessage}>{error}</p>} {/* Ошибка */}

          <CustomButton
            text={
              isPasswordReset
                ? t("resetForm.saveNewPasswordButton")
                : t("resetForm.resetPasswordButton")
            }
            style={{
              width: "268px",
              height: "32px",
            }}
            type="submit" // Кнопка для отправки формы
          />

          <div className={styles.lineBox}>
            <div className={styles.line}></div>
            <p>{t("loginForm.or")}</p>
            <div className={styles.line}></div>
          </div>

          <Link to={"/register"} className={styles.createAccount}>
            {t("resetForm.createAccount")} {/* Ссылка для создания аккаунта */}
          </Link>
          <div className={styles.back}>
            <Link to={"/login"} style={{ color: "var(--color-text-dark)", fontWeight: 500 }}>
              {t("resetForm.back")} {/* Ссылка для возврата к форме логина */}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
