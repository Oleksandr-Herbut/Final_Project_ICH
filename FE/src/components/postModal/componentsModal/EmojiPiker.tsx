import React, { useState } from 'react'; // Импортируем React и хук useState из библиотеки React.
import s from '../postModal.module.css'; // Импортируем стили CSS для компонента.

const EmojiPicker: React.FC<{ onSelectEmoji: (emoji: string) => void }> = ({ onSelectEmoji }) => { // Объявляем компонент EmojiPicker с типизацией.
    const [isOpen, setIsOpen] = useState(false); // Хук состояния для открытия/закрытия списка эмодзи.
    const emojis = [
        ...Array.from({ length: 300 }, (_, i) => String.fromCodePoint(0x1f600 + i)), // Расширяет текущий набор эмодзи от 0x1f600.
        ...Array.from({ length: 20 }, (_, i) => String.fromCodePoint(0x2700 + i)), // Добавляет другие эмодзи (символы) от 0x2700.
        ...Array.from({ length: 20 }, (_, i) => String.fromCodePoint(0x1f300 + i)), // Добавляет больше эмодзи (погода и т.п.) от 0x1f300.
        ...Array.from({ length: 20 }, (_, i) => String.fromCodePoint(0x1f600 + i)), // Добавляет ещё эмодзи от 0x1f600.
        // Вы можете продолжать добавлять другие диапазоны или конкретные эмодзи по мере необходимости.
    ];

    const toggleEmojiPicker = () => { // Функция для открытия/закрытия списка эмодзи.
        setIsOpen((prev) => !prev);
        if (!isOpen) { // Если список открыт, закрыть его через 6 секунд.
            setTimeout(() => setIsOpen(false), 6000);
        }
    };

    return (
        <div className={s.emojiContainer}>
            <button type="button" className={s.emojiButton} onClick={toggleEmojiPicker}>
                😊
            </button>
            {isOpen && (
                <div className={s.emojiList}>
                    {emojis.map((emoji, index) => ( // Итерация по массиву эмодзи.
                        <span key={index} className={s.emojiItem} onClick={() => onSelectEmoji(emoji)}>
                            {emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmojiPicker; // Экспорт компонента EmojiPicker по умолчанию.
