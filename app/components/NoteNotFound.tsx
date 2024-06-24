import { Link } from "@remix-run/react";
import { Button, Chip, Input } from "@nextui-org/react";
import styles from "./NoteNotFound.module.scss";
import { Icon, IconId } from "~/components/Icon";

type NoteNotFoundProps = {
	noteId: string | undefined;
};

export const NoteNotFound = ({ noteId }: NoteNotFoundProps) => (
	<div className={styles.notFound}>
		<Chip size="lg" variant="bordered" color="danger">
			404
		</Chip>
		<div>Message with id:</div>
		<Chip size="sm" color="warning">
			{noteId}
		</Chip>
		<div>doesn’t exist, or it expired, or maybe it never existed.</div>
		<Link to="/">
			<Button size="sm" color="success">
				Go to Home
			</Button>
		</Link>
	</div>
);
