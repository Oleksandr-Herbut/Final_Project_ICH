import { NavLink } from "react-router-dom"; // Импортирует компонент NavLink из react-router-dom для навигации.
import { useState } from "react"; // Импортирует хук useState из React.
import { useSelector } from "react-redux"; // Импортирует хук useSelector из библиотеки React Redux.
import s from "./menubar.module.css"; // Импортирует стили CSS для компонента.
import homeIcon from "../../assets/nav_icons/home/home.svg"; // Импортирует иконку главной страницы.
import homeIconActive from "../../assets/nav_icons/home/home-active.svg"; // Импортирует активную иконку главной страницы.
import searchIcon from "../../assets/nav_icons/search/search.svg"; // Импортирует иконку поиска.
import searchIconActive from "../../assets/nav_icons/search/search-active.svg"; // Импортирует активную иконку поиска.
import exploreIcon from "../../assets/nav_icons/explore/explore.svg"; // Импортирует иконку исследования.
import exploreIconActive from "../../assets/nav_icons/explore/explore-active.svg"; // Импортирует активную иконку исследования.
import messagesIcon from "../../assets/nav_icons/messages/messages.svg"; // Импортирует иконку сообщений.
import messagesIconActive from "../../assets/nav_icons/messages/messages-active.svg"; // Импортирует активную иконку сообщений.
import notificationsIcon from "../../assets/nav_icons/notifications/notifications.svg"; // Импортирует иконку уведомлений.
import notificationsIconActive from "../../assets/nav_icons/notifications/notifications-active.svg"; // Импортирует активную иконку уведомлений.
import createIcon from "../../assets/nav_icons/create/create.svg"; // Импортирует иконку создания.
import createIconActive from "../../assets/nav_icons/create/create-active.svg"; // Импортирует активную иконку создания.
import { useTranslation } from "react-i18next"; // Импортирует хук useTranslation из библиотеки i18next для перевода.
import logoMenu from "../../assets/logo-ichgram.svg"; // Импортирует логотип.
import { RootState } from "../../store/store"; // Импортирует тип RootState из store.
import logoSmallMenu from "../../assets/nav_icons/ich.png"; // Импортирует маленький логотип.
import SearchModal from "../searchModal/SearchModal"; // Импортирует компонент SearchModal.
import CustomModal from "../customModal/CustomModal"; // Импортирует компонент CustomModal.
import NotificationsModal from "../notificationModal/NotificationModal"; // Импортирует компонент NotificationsModal.

const MenuBar = () => {
    const { t } = useTranslation(); // Использует хук useTranslation для перевода.
    const user = useSelector((state: RootState) => state.auth.user); // Получение текущего пользователя из состояния Redux.
    const [isModalOpen, setIsModalOpen] = useState(false); // Хук состояния для открытия модального окна.
    const [modalContent, setModalContent] = useState<React.ReactNode>(null); // Хук состояния для содержимого модального окна.
    const [activeLink, setActiveLink] = useState<string>(''); // Хук состояния для активной ссылки.
    const [modalSize, setModalSize] = useState<"default" | "left" | "large" | "small">("default"); // Хук состояния для размера модального окна.

    const openModal = (type: string) => { // Функция для открытия модального окна.
        setIsModalOpen(true);
        switch (type) {
            case "search":
                setModalSize("left");
                setModalContent(<SearchModal />);
                break;
            case "notifications":
                setModalSize("left");
                setModalContent(<NotificationsModal />);
                break;
            default:
                setModalContent(null);
        }
    };

    const closeModal = () => { // Функция для закрытия модального окна.
        setIsModalOpen(false);
        setModalContent(null);
        setActiveLink('');
    };

    const handleClick = (link: string) => { // Функция для обработки клика по ссылке.
        setActiveLink(link); // Устанавливает активную ссылку.
    };

    return (
        <div className={s.menuBar}>
            <img src={logoMenu} alt="logo" className={s.logo}></img> 
            <img src={logoSmallMenu} alt="logo" className={s.logoSmall}></img> 
    
            <NavLink
                to="/home"
                onClick={() => handleClick("home")}
                className={activeLink === "home" ? s.activeLink : s.link}
            >
                <>
                    <img src={activeLink === "home" ? homeIconActive : homeIcon} alt="home" />
                    <span>{t("menubar.home")}</span>
                </>
            </NavLink>
    
            <NavLink
                to="/search"
                onClick={(e) => {
                    e.preventDefault(); // Блокирует переход.
                    openModal("search"); // Открывает модальное окно.
                    handleClick("search"); // Устанавливает "search" как активное.
                }}
                className={activeLink === "search" ? s.activeLink : s.link}
            >
                <>
                    <img src={activeLink === "search" ? searchIconActive : searchIcon} alt="search" />
                    <span>{t("menubar.search")}</span>
                </>
            </NavLink>
    
            <NavLink
                to="/explore"
                onClick={() => handleClick("explore")}
                className={activeLink === "explore" ? s.activeLink : s.link}
            >
                <>
                    <img src={activeLink === "explore" ? exploreIconActive : exploreIcon} alt="explore" />
                    <span>{t("menubar.explore")}</span>
                </>
            </NavLink>
    
            <NavLink
                to="/messages"
                onClick={() => handleClick("messages")}
                className={activeLink === "messages" ? s.activeLink : s.link}
            >
                <>
                    <img src={activeLink === "messages" ? messagesIconActive : messagesIcon} alt="messages" />
                    <span>{t("menubar.messages")}</span>
                </>
            </NavLink>
    
            <NavLink
                to="/notifications"
                onClick={(e) => {
                    e.preventDefault(); // Блокирует переход.
                    openModal("notifications"); // Открывает модальное окно.
                    handleClick("notifications"); // Устанавливает "notifications" как активное.
                }}
                className={activeLink === "notifications" ? s.activeLink : s.link}
            >
                <>
                    <img
                        src={
                            activeLink === "notifications"
                                ? notificationsIconActive
                                : notificationsIcon
                        }
                        alt="notifications"
                    />
                    <span>{t("menubar.notifications")}</span>
                </>
            </NavLink>
    
            <NavLink
                to="/create"
                onClick={() => handleClick("create")}
                className={activeLink === "create" ? s.activeLink : s.link}
            >
                <>
                    <img src={activeLink === "create" ? createIconActive : createIcon} alt="create" />
                    <span>{t("menubar.create")}</span>
                </>
            </NavLink>
    
            <nav className={s.profileLink}>
                {user && (
                    <NavLink
                        to="/profile"
                        onClick={() => handleClick("profile")}
                        className={activeLink === "profile" ? s.activeLink : s.link}
                    >
                        <div className={s.profileLink_photoBox}>
                            <img src={user.profile_image} alt={user.username} /> 
                        </div>
                        <span>{t("profileLink.profile")}</span>
                    </NavLink>
                )}
            </nav>
    
            <CustomModal isOpen={isModalOpen} onClose={closeModal} modalSize={modalSize}>
                {modalContent} 
            </CustomModal>
        </div>
    );
};
    
export default MenuBar; // Экспорт компонента MenuBar по умолчанию.
