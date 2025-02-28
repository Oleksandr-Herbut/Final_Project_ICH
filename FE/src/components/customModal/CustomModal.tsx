// CustomModal.tsx
import React from 'react';
import styles from './customModal.module.css'; // Подключаем модульные стили

// Интерфейс, описывающий свойства модального окна
interface CustomModalProps {
    isOpen: boolean; // Флаг, указывающий, открыто ли модальное окно
    onClose: () => void; // Функция для закрытия модального окна
    children: React.ReactNode; // Содержимое модального окна
    modalSize: 'default' | 'left' | 'large' | 'small'; // Варианты размеров окна
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children, modalSize }) => {
    // Если isOpen === false, модальное окно не рендерится
    if (!isOpen) return null;

    // Функция, определяющая CSS-класс модального окна в зависимости от переданного размера
    const getModalClass = () => {
        switch (modalSize) {
            case 'large':
                return styles.ModalLarge;
            case 'small':
                return styles.ModalSmall;
            case 'left':
                return styles.ModalLeft;
            default:
                return styles.ModalDefault;
        }
    };

    return (
        // Затемняющий фон модального окна, закрывает модалку при клике
        <div className={styles.Overlay} onClick={onClose}>
            {/* Само модальное окно */}
            <div className={`${styles.Modal} ${getModalClass()}`} onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закрытия модального окна */}
                <button className={styles.modalCloseButton} onClick={onClose}>×</button>
                {/* Контент внутри модального окна */}
                <div className={styles.ModalContent}>
                    {children} {/* Используем children, чтобы передавать любой контент */}
                </div>
            </div>
        </div>
    );
};

export default CustomModal; // Экспортируем компонент
