import s from "./footer.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className={s.footer}>
            <div className={s.footerContainer}>
                <Link to="/home">{t("footer.home")}</Link>
                <Link to="/search">{t("footer.search")}</Link>
                <Link to="/explore">{t("footer.explore")}</Link>
                <Link to="/messages">{t("footer.messages")}</Link>
                <Link to="/notifications">{t("footer.notifications")}</Link>
                <Link to="/create">{t("footer.create")}</Link>
            </div>
            <div className={s.blockBottom}>
                <p>By Aleksandr © 2025 ICHgram </p>
            </div>
        </div>
    )
}