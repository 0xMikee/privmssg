import styles from "./HomePage.module.scss";
import { Button } from "@nextui-org/react";
import { Link } from "@remix-run/react";
import { Icon, IconId } from "~/components/Icon";

const HomePage = () => {
	return (
		<div className={styles.homePage}>
			<Link to="/notes/new">
				<Button variant="faded" className={styles.createBtn}>
					Create a New Private Message
				</Button>
			</Link>
		</div>
	);
};

export default HomePage;
