import React, { CSSProperties } from "react"; 
import styles from "./customButton.module.css"; // Импортируем модульные стили для кнопки

// Интерфейс для описания пропсов кнопки
interface ButtonProps {
  text: string; // Текст, отображаемый на кнопке
  onClick?: () => void; // Опциональный обработчик клика
  variant?: "primary" | "secondary" | "danger"; // Вариант оформления кнопки (по умолчанию "primary")
  disabled?: boolean; // Флаг, отключающий кнопку
  icon?: React.ReactNode; // Опциональный иконочный элемент
  className?: string; // Дополнительные классы для стилизации
  style?: CSSProperties; // Дополнительные inline-стили
  type?: "button" | "submit" | "reset"; // Тип кнопки (по умолчанию "button")
}

// Основной компонент кнопки
const CustomButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = "primary", // Значение по умолчанию - "primary"
  disabled = false, // По умолчанию кнопка активна
  icon,
  className = "", // Пустая строка по умолчанию, если класс не передан
  style = {}, // По умолчанию нет inline-стилей
  type = "button", // Тип кнопки по умолчанию
}) => {
  // Формируем строку классов, объединяя стили
  const buttonClass = [
    styles.button, // Базовый стиль кнопки
    variant ? styles[variant] : styles.primary, // Применяем стиль в зависимости от переданного варианта
    disabled ? styles.disabled : "", // Если кнопка отключена, добавляем стиль disabled
    className, // Добавляем пользовательские классы, если они есть
  ]
    .filter(Boolean) // Убираем пустые значения, чтобы не было лишних пробелов
    .join(" "); // Объединяем массив классов в строку через пробел

  return (
    <button
      type={type} // Устанавливаем переданный тип кнопки
      className={buttonClass} // Применяем собранные классы
      onClick={onClick} // Назначаем обработчик клика
      disabled={disabled} // Устанавливаем атрибут disabled, если передан флаг disabled
      style={style} // Добавляем переданные inline-стили
    >
      {icon && <span className={styles.icon}>{icon}</span>} {/* Если передана иконка, отображаем её */}
      <span className={styles.text}>{text}</span> {/* Основной текст кнопки */}
    </button>
  );
};

export default CustomButton; // Экспортируем компонент для использования в других частях приложения
