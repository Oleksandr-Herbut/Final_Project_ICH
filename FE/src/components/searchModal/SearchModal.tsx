import { useState, useEffect } from 'react'; // Импортируем хуки useState и useEffect из библиотеки React.
import { useSelector, useDispatch } from 'react-redux'; // Импортируем хуки useSelector и useDispatch из библиотеки React Redux.
import CustomInput from "../customInput/CustomInput"; // Импортируем компонент CustomInput.
import s from "./searchModal.module.css"; // Импортируем стили CSS для компонента.
import { useTranslation } from 'react-i18next'; // Импортируем хук useTranslation из библиотеки i18next для перевода.
import { getAllUsers, addSearchResult } from '../../store/slices/userSlice'; // Импортируем действия getAllUsers и addSearchResult из userSlice.
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate из библиотеки react-router-dom.
import { RootState, AppDispatch } from '../../store/store'; // Импортируем типы RootState и AppDispatch из файла store.
import { CondensedUser } from "../../store/types/instanceTypes.ts"; // Импортируем тип CondensedUser из типов.

const SearchBar = () => { // Объявляем компонент SearchBar.
    const { t } = useTranslation(); // Используем хук useTranslation для перевода.
    const dispatch: AppDispatch = useDispatch(); // Инициализируем dispatch для отправки действий в Redux.
    const navigate = useNavigate(); // Инициализируем navigate для навигации.
    const users = useSelector((state: RootState) => state.user.user || []); // Получаем пользователей из состояния Redux.
    const recentSearchResults = useSelector((state: RootState) => state.user.search_results || []); // Получаем последние результаты поиска из состояния Redux.
    const [searchUsers, setSearchUsers] = useState(''); // Хук состояния для строки поиска.

    useEffect(() => {
        dispatch(getAllUsers()); // Запрос на получение всех пользователей при загрузке компонента.
    }, [dispatch]); // Выполнение эффекта при изменении dispatch.

    const filteredUsers = Array.isArray(users) ? users.filter((user) => {
        return user.username.toLowerCase().includes(searchUsers.toLowerCase()); // Фильтрация пользователей по строке поиска.
    }) : [];

    const handleUserClick = (user: CondensedUser) => { // Обработка клика по пользователю.
        navigate(`/profile/${user._id}`); // Переход на страницу профиля пользователя.
        dispatch(addSearchResult(user)); // Добавление пользователя в результаты поиска.
    };

    const handleInputChange = (value: string) => { // Обработка изменений в строке поиска.
        setSearchUsers(value);
    };

    return (
        <div className={s.searchBar}>
            <div className={s.searchBar_box}>
                <h3>{t('searchBar.search')}</h3> {/* Заголовок поиска */}
                <CustomInput
                    placeholder={t('searchBar.searchPlaceholder')}
                    value={searchUsers}
                    onChange={(value) => handleInputChange(value)}
                    style={{ background: "var(--color-bg-dark-grey)" }}
                />
                <h5>{t('searchBar.resent')}</h5> {/* Заголовок последних результатов поиска */}
                <div className={s.searchBar_box_users}>
                    {searchUsers.length > 0 ? ( // Проверка наличия строки поиска.
                        filteredUsers.map((user) => ( // Отображение отфильтрованных пользователей.
                            <div key={user._id} className={s.searchBar_box_user} onClick={() => handleUserClick(user)}>
                                <img src={user.profile_image} alt={user.username} />
                                <p>{user.username}</p>
                            </div>
                        ))
                    ) : (
                        recentSearchResults.map((user) => ( // Отображение последних результатов поиска.
                            <div key={user._id} className={s.searchBar_box_user} onClick={() => handleUserClick(user)}>
                                <img src={user.profile_image} alt={user.username} />
                                <p>{user.username}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar; // Экспорт компонента SearchBar по умолчанию.
