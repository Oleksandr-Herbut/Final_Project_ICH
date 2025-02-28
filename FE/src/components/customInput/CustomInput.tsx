import React, { CSSProperties } from 'react';
import styles from './customInput.module.css'; // Импорт модульных стилей для инпута

// Интерфейс, описывающий возможные пропсы компонента CustomInput
interface InputProps {
  placeholder?: string; // Текст-подсказка в поле ввода
  value?: string; // Текущее значение инпута
  onChange?: (value: string) => void; // Функция-обработчик изменения значения
  icon?: React.ReactNode; // Опциональная иконка слева от инпута
  errorMessage?: string; // Сообщение об ошибке (если есть)
  type?: 'text' | 'password' | 'email'; // Тип инпута (по умолчанию 'text')
  className?: string; // Дополнительные классы для стилизации
  style?: CSSProperties; // Inline-стили для инпута
  showError?: boolean; // Показывать ли ошибку (не используется в коде)
}

// Компонент CustomInput
const CustomInput: React.FC<InputProps> = ({
  placeholder = '', // Значение по умолчанию - пустая строка
  value = '', // Значение по умолчанию - пустая строка
  onChange,
  icon,
  errorMessage,
  type = 'text', // Тип инпута по умолчанию - текстовый
  className = '',
  style = {},
}) => {

  // Функция-обработчик изменения значения инпута
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value); // Вызываем onChange, если он передан
  };

  // Формируем строку классов с учетом возможной ошибки
  const inputClass = `${styles.inputContainer} ${errorMessage ? styles.error : ''} ${className}`;

  return (
    <div className={inputClass}> {/* Контейнер инпута */}
      {icon && <span className={styles.icon}>{icon}</span>} {/* Если передана иконка, отображаем её */}
      <input
        type={type} // Устанавливаем переданный тип инпута
        placeholder={placeholder} // Устанавливаем переданный placeholder
        value={value} // Значение инпута
        onChange={handleInputChange} // Обработчик изменения значения
        className={styles.input} // Применяем класс для стилизации поля ввода
        style={style} // Inline-стили
      />
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} 
      {/* Если есть сообщение об ошибке, показываем его */}
    </div>
  );
};

export default CustomInput; // Экспортируем компонент для использования в других частях приложения
