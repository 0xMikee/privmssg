import { Link } from "@remix-run/react";
import { Button, Chip } from "@nextui-org/react";
import styles from "./NoteNotFound.module.scss";

type NoteNotFoundProps = {
	noteId: string | undefined;
};

export const NoteNotFound = ({ noteId }: NoteNotFoundProps) => (
	<div className={styles.notFound}>
		<Chip size="lg" variant="bordered" color="danger">
			404
		</Chip>
		<div>Message with id:</div>
		<Chip size="sm" color="warning" variant="bordered">
			{noteId}
		</Chip>
		<div>doesn’t exist, or it expired, or maybe it never existed.</div>
		<Link to="/">
			<Button variant="bordered">Go to Home</Button>
		</Link>
	</div>
);
