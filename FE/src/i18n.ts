import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./translations/en";
import { ua } from "./translations/ua";
import { ru } from "./translations/ru";
import { es } from "./translations/es";
import { fr } from "./translations/fr";

// Определяем язык по умолчанию (из localStorage или браузера)
const savedLanguage = localStorage.getItem("language") || navigator.language.slice(0, 2);
const availableLanguages = ["en", "ua", "ru", "es", "fr"]; // Список доступных языков
const defaultLanguage = availableLanguages.includes(savedLanguage) ? savedLanguage : "en"; // Проверяем, есть ли язык в доступных

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ua: { translation: ua },
    ru: { translation: ru },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: defaultLanguage, // Устанавливаем язык
  fallbackLng: "en", // Если язык не найден, используем английский
  interpolation: {
    escapeValue: false,
  },
});

// Функция для смены языка с сохранением в localStorage
export const changeLanguage = (lang : string) => {
  if (availableLanguages.includes(lang)) {
    i18n.changeLanguage(lang); // Меняем язык
    localStorage.setItem("language", lang); // Сохраняем язык в localStorage
  }
};


export default i18n;
