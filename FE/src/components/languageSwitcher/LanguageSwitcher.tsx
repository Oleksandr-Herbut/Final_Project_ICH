import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css"; // Импортируем модуль стилей

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <div className={styles.container}>
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className={styles.select}
      >
        <option value="en">🇬🇧 English</option>
        <option value="ru">🇷🇺 Русский</option>
        <option value="ua">🇺🇦 Українська</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
