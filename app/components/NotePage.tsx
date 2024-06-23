import { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Link, useFetcher } from "@remix-run/react";
import styles from "./NotePage.module.scss";

type NotePageProps = {
	notes: Array<{
		id: string;
		title: string;
	}>;
};

const NotePage = ({ notes }: NotePageProps) => {
	const fetcher = useFetcher();

	useEffect(() => {
		const viewedNotes = JSON.parse(localStorage.getItem("viewedNotes") || "[]");

		if (viewedNotes.length > 0) {
			viewedNotes.forEach((noteId: string) => {
				fetcher.submit(
					{ noteId },
					{ method: "post", action: "/api/deleteNote" }
				);
			});

			localStorage.removeItem("viewedNotes");
		}
	}, [fetcher]);

	if (!notes) return null;

	return (
		<div className={styles.notePage}>
			<div className={styles.header}>
				Private Messages:
				<Link to="/notes/new">
					<Button color="success" variant="bordered" size="sm">
						Create New Private Message
					</Button>
				</Link>
			</div>
			<div className={styles.content}>
				<div className={styles.notes}>
					{notes.map((note) => (
						<Link
							to={`/notes/${note.id}`}
							key={note.id}
							className={styles.note}
						>
							<Button size="sm">
								{note.title}
							</Button>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default NotePage;
