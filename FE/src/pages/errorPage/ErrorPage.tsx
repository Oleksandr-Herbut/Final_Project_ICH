import image from "../../assets/login_back.png"
import s from "./ErrorPage.module.css"

export const ErrorPage = () => {
    return (
        <div className={s.container}>
            <img src={image} alt='Image'
            className={s.image}/>
            <div className={s.content}>
                <p className={s.title}>Oops! Page Not Found (404 Error)</p>
                <p className={s.text}>We're sorry, but the page you're looking for doesn't seem to exist.
                    If you typed the URL manually, please double-check the spelling.
                    If you clicked on a link, it may be outdated or broken.</p>
            </div>
        </div>
    );
};