import { useState } from "react"; // Импортируем хук useState из библиотеки React.
import { Link, useNavigate } from "react-router-dom"; // Импортируем компонент Link и хук useNavigate из библиотеки react-router-dom.
import styles from "./registerForm.module.css"; // Импортируем модульные стили CSS для компонента.
import logo from "../../assets/logo-ichgram.svg"; // Импортируем логотип.
import { useTranslation } from "react-i18next"; // Импортируем хук useTranslation из библиотеки i18next для перевода.
import { ToastContainer, toast } from "react-toastify"; // Импортируем Toast и контейнер для Toast из библиотеки react-toastify.
import "react-toastify/dist/ReactToastify.css"; // Импортируем стили для Toast.

export const RegisterForm = () => { // Объявляем компонент RegisterForm.
  const { t } = useTranslation(); // Используем хук useTranslation для перевода.
  const navigate = useNavigate(); // Инициализируем navigate для навигации.

  const [userObj, setUserObj] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  }); // Хук состояния для объекта пользователя.

  const [error, setError] = useState({
    email: "",
    username: "",
    general: "",
  }); // Хук состояния для ошибок.

  const handleInputChange = (field: keyof typeof userObj) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserObj((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }; // Функция для обработки изменений в полях ввода.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Функция для обработки отправки формы.
    e.preventDefault();
    setError((prev) => ({ ...prev, general: "" }));

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      });

      console.log("Response:", response.status);

      if (response.ok) {
        // Показать уведомление об успешной регистрации
        toast.success(t("registerForm.successMessage"), {
          position: "top-center",
        });

        // Переход на страницу логина через 3 секунды
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const err = await response.json();
        setError(err);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError({ email: "", username: "", general: "An error occurred" });
    }
  };

  return (
    <div className={styles.registerFormBox}>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <img src={logo} alt="logo" /> {/* Логотип */}
        <h4>{t("registerForm.title")}</h4> {/* Заголовок формы регистрации */}
        <input
          placeholder={t("registerForm.placeholderEmail")}
          value={userObj.email}
          onChange={handleInputChange("email")}
          type="email"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
          }}
        />
        {error.email && <p className={styles.errorMessage}>{error.email}</p>} {/* Ошибка для email */}
        <input
          placeholder={t("registerForm.placeholderFullName")}
          value={userObj.full_name}
          onChange={handleInputChange("full_name")}
          type="text"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
            marginTop: "6px",
          }}
        />
        <input
          placeholder={t("registerForm.placeholderUsername")}
          value={userObj.username}
          onChange={handleInputChange("username")}
          type="text"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
            marginTop: "6px",
          }}
        />
        {error.username && <p className={styles.errorMessage}>{error.username}</p>} {/* Ошибка для username */}
        <input
          placeholder={t("registerForm.placeholderPassword")}
          value={userObj.password}
          onChange={handleInputChange("password")}
          type="password"
          style={{
            paddingLeft: "8px",
            backgroundColor: "#FAFAFA",
            color: "#737373",
            marginTop: "6px",
          }}
        />
        {error.general && <p className={styles.errorMessage}>{error.general}</p>} {/* Общая ошибка */}
        <p className={styles.registerForm_p1}>
          {t("registerForm.termsInfo")} <span className={styles.agreementLink}>{t("registerForm.learnMore")}</span> {/* Информация об условиях использования */}
        </p>
        <p className={styles.registerForm_p2}>
          {t("registerForm.agreementText")} <span className={styles.agreementLink}>{t("registerForm.terms")}</span>,{" "}
          <span className={styles.agreementLink}>{t("registerForm.privacyPolicy")}</span>,{" "}
          <span className={styles.agreementLink}>{t("registerForm.cookiesPolicy")}</span>. {/* Информация о политике конфиденциальности и использования cookie */}
        </p>
        <button className={styles.registerButton} type="submit">
          {t("registerForm.signUpButton")} {/* Кнопка регистрации */}
        </button>
      </form>
      <div className={styles.haveAccountBox}>
        <p>
          {t("registerForm.haveAccount")}{" "}
          <Link to={"/login"} style={{ color: "var(--color-text-blue)", fontWeight: 600 }}>
            {t("registerForm.login")}
          </Link> {/* Ссылка для входа в аккаунт */}
        </p>
      </div>
      {/* Контейнер для уведомлений */}
      <ToastContainer />
    </div>
  );
};
