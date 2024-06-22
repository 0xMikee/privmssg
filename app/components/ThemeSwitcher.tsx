import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import styles from "./ThemeSwitcher.module.scss";
import { Icon, IconId } from "~/components/Icon";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDarkTheme = theme === "dark";

    return (
        <Button
            isIconOnly
            variant="bordered"
            className={styles.button}
            onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
        >
            <Icon id={isDarkTheme ? IconId.MOON : IconId.SUN} className={styles.icon} />
        </Button>
    );
};

export default ThemeSwitcher;
