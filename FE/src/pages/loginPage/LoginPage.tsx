import { useState, useEffect } from "react"; // Импортируем хуки useState и useEffect для работы с состоянием и побочными эффектами.
import s from "./loginPage.module.css"; // Импортируем стили для страницы логина.
import { LoginForm } from "../../components/loginForm/LoginForm"; // Импортируем компонент формы логина.

import phoneFrame from "../../assets/loginScreen//phone.png"; // Импортируем изображение рамки телефона.
import screen1 from "../../assets/loginScreen/screenshot1.png"; // Импортируем первый скриншот.
import screen2 from "../../assets/loginScreen/screenshot2.png"; // Импортируем второй скриншот.
import screen3 from "../../assets/loginScreen/screenshot3.png"; // Импортируем третий скриншот.
import screen4 from "../../assets/loginScreen/screenshot4.png"; // Импортируем четвертый скриншот.

export const LoginPage = () => { // Создаем функциональный компонент для страницы логина.
  const screenShots = [screen1, screen2, screen3, screen4]; // Массив скриншотов, которые будут показываться.

  const [screenShotIndex, setScreenShotIndex] = useState(0); // Локальное состояние для текущего индекса скриншота.

  // useEffect срабатывает при монтировании компонента.
  useEffect(() => {
    // Интервал для смены скриншотов каждые 3 секунды.
    const interval = setInterval(() => {
      // Обновляем индекс скриншота, по кругу.
      setScreenShotIndex((prev) => (prev + 1) % screenShots.length);
    }, 3000); // Каждые 3000 миллисекунд (3 секунды).

    // Очищаем интервал при размонтировании компонента.
    return () => clearInterval(interval);
  }, [screenShots.length]); // Зависимость от длины массива скриншотов (на всякий случай).

  return (
    <div className={s.loginPage}> {/* Контейнер для всей страницы логина. */}
      <div className={s.phoneContainer}> {/* Контейнер с изображением телефона. */}
        <img src={phoneFrame} alt="phone frame" className={s.phoneFrame} /> {/* Рамка телефона. */}
        <div className={s.screen}> {/* Экран телефона, где показываются скриншоты. */}
          <img
            key={screenShotIndex} // Уникальный ключ для перерендеринга, чтобы изображение менялось.
            src={screenShots[screenShotIndex]} // Источник изображения для экрана телефона.
            alt="App Screenshot" // Описание изображения для доступности.
            className={s.screenImage} // Применение стилей для изображения.
          />
        </div>
      </div>
      <div className={s.loginFormBox}> {/* Контейнер для формы логина. */}
        <LoginForm /> {/* Компонент формы логина. */}
      </div>
    </div>
  );
};
