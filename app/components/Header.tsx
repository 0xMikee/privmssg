import styles from "./Header.module.scss";
import ThemeSwitcher from "~/components/ThemeSwitcher";
import {Link} from "@remix-run/react";
import {Icon, IconId} from "~/components/Icon";
import {Button} from "@nextui-org/react";

const Header = () => {
	return (
		<header className={styles.header}>
			<div className={styles.content}>
				<Link to="/" className={styles.logo}>
					<div className={styles.logoText}>Priv</div>
					<Icon className={styles.logoIcon} id={IconId.LOCK} />
					<div className={styles.logoText}>Message</div>
				</Link>
				<div className={styles.buttons}>
					<a href="https://github.com/0xMikee/privmssg/tree/main" target="_blank">
						<Button size="sm" variant="bordered" isIconOnly>
							<Icon id={IconId.SOURCECODE} className={styles.sourceIcon} />
						</Button>
					</a>
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
};

export default Header;
