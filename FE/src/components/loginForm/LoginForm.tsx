import { useState } from "react"; // Хук для управления состоянием
import { useTranslation } from "react-i18next"; // Хук для локализации
import { useDispatch } from "react-redux"; // Хук для отправки экшенов в Redux
import { Link, useNavigate } from "react-router-dom"; // Хуки для навигации
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"; // Иконки для отображения/скрытия пароля
import { $api } from "../../api/api"; // API-клиент для отправки запросов
import CustomInput from "../customInput/CustomInput"; // Кастомный инпут

import styles from "./loginForm.module.css"; // Импорт модульных стилей
import logo from "../../assets/logo-ichgram.svg"; // Импорт логотипа

export const LoginForm = () => {
  const { t } = useTranslation(); // Получаем функцию для перевода строк
  const navigate = useNavigate(); // Хук для программной навигации
  const dispatch = useDispatch(); // Хук для вызова Redux-экшенов

  // Состояние для хранения данных пользователя
  const [userObj, setUserObj] = useState({ email: "", password: "" });

  // Состояния для ошибок и сообщений
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [emailErrorMassage, setEmailErrorMassage] = useState("");
  const [passwordErrorMassage, setPasswordErrorMassage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Показывать/скрывать пароль

  // Обработчик изменения инпутов
  const handleInputChange = (field: keyof typeof userObj) => (value: string) => {
    setUserObj((prev) => ({
      ...prev,
      [field]: value, // Обновляем соответствующее поле в объекте userObj
    }));
  };

  // Функция валидации email
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/; // Регулярное выражение для проверки email
    return re.test(email);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    let hasError = false;

    // Валидация email
    if (userObj.email === "") {
      setEmailErrorMassage(t("loginForm.emailRequired"));
      setShowEmailError(true);
      hasError = true;
    } else if (!validateEmail(userObj.email)) {
      setEmailErrorMassage(t("loginForm.emailInvalidFormat"));
      setShowEmailError(true);
      hasError = true;
    } else {
      setShowEmailError(false);
      setEmailErrorMassage("");
    }

    // Валидация пароля
    if (userObj.password === "") {
      setPasswordErrorMassage(t("loginForm.passwordRequired"));
      setShowPasswordError(true);
      hasError = true;
    } else if (userObj.password.length < 6) {
      setPasswordErrorMassage(t("loginForm.passwordInvalid"));
      setShowPasswordError(true);
      hasError = true;
    } else {
      setShowPasswordError(false);
      setPasswordErrorMassage("");
    }

    // Если есть ошибки — прерываем отправку формы
    if (hasError) return;

    setIsSubmitting(true);
    setAuthError("");

    try {
      // Отправляем запрос на авторизацию
      const response = await $api.post("/auth/login", userObj);
      const { token, user } = response.data;

      if (token) {
        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Отправляем данные пользователя в Redux store
        dispatch({ type: "SET_USER", payload: user });

        // Перенаправляем пользователя на главную страницу
        navigate("/home");
      } else {
        setAuthError(t("loginForm.invalidEmailOrPassword")); // Ошибка при отсутствии токена
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(t("loginForm.invalidEmailOrPassword")); // Сообщение об ошибке
    } finally {
      setIsSubmitting(false); // Разрешаем повторное нажатие на кнопку
    }
  };

  return (
    <div className={styles.loginFormBox}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />

        {/* Поле ввода email */}
        <CustomInput
          placeholder={t("loginForm.placeholderEmail")}
          value={userObj.email}
          onChange={handleInputChange("email")}
          type="email"
          style={{
            paddingLeft: "8px",
            backgroundColor: "var(--color-bg-light-grey)",
            color: "var(--color-text-grey)",
          }}
          showError={showEmailError}
          errorMessage={emailErrorMassage}
        />

        {/* Поле ввода пароля с иконкой */}
        <div className={styles.passwordContainer}>
          <CustomInput
            placeholder={t("loginForm.placeholderPassword")}
            value={userObj.password}
            onChange={handleInputChange("password")}
            type={showPassword ? "text" : "password"} // Переключение вида пароля
            style={{
              paddingLeft: "8px",
              backgroundColor: "var(--color-bg-light-grey)",
              color: "var(--color-text-grey)",
              margin: "7px 0 15px",
            }}
            showError={showPasswordError}
            errorMessage={passwordErrorMassage}
          />
          {/* Кнопка для скрытия/отображения пароля */}
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </span>
        </div>

        {/* Кнопка входа */}
        <button className={styles.loginButton} type="submit" disabled={isSubmitting}>
          {t("loginForm.loginButton")}
        </button>

        {/* Сообщение об ошибке авторизации */}
        {authError && <div className={styles.errorMessage}>{authError}</div>}

        {/* Разделитель "или" */}
        <div className={styles.lineBox}>
          <div className={styles.line}></div>
          <p>{t("loginForm.or")}</p>
          <div className={styles.line}></div>
        </div>

        {/* Ссылка на восстановление пароля */}
        <Link to={"/reset"} className={styles.forgotPasswordLink}>
          {t("loginForm.forgotPassword")}
        </Link>
      </form>

      {/* Ссылка на регистрацию */}
      <div className={styles.haveAccountBox}>
        <p>
          {t("loginForm.haveAccount")}{" "}
          <Link
            to={"/register"}
            style={{ color: "var(--color-text-blue)", fontWeight: 600 }}
          >
            {t("loginForm.sign")}
          </Link>
        </p>
      </div>
    </div>
  );
};
