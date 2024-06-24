import styles from "./HomePage.module.scss";
import { Button } from "@nextui-org/react";
import { Link } from "@remix-run/react";
import { Icon, IconId } from "~/components/Icon";

const HomePage = () => {
	return (
		<div className={styles.homePage}>
			<Link to="/notes">
				<Button
					startContent={<Icon id={IconId.NOTE} className={styles.noteIcon} />}
					variant="bordered"
					size="sm"
				>
					Note DB
				</Button>
			</Link>
			<Link to="/notes/new">
				<Button size="sm" color="success" variant="bordered">
					Create a New Private Message
				</Button>
			</Link>
		</div>
	);
};

export default HomePage;
