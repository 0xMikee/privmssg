import styles from "./Header.module.scss"
import ThemeSwitcher from "~/components/ThemeSwitcher";
import {Link} from "@remix-run/react";
import {Icon, IconId} from "~/components/Icon";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <Link to="/" className={styles.logo}>
                    <div className={styles.logoText}>Priv</div>
                    <Icon className={styles.logoIcon} id={IconId.LOCK} />
                    <div className={styles.logoText}>Message</div>
                </Link>
                <ThemeSwitcher />
            </div>
        </header>
    )
};

export default Header;