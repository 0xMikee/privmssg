import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { deleteExpiredNotes } from "~/utils/note.server";
import { NoteDetail } from "~/components/NoteDetail";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import {Outlet} from "react-router";
import {NoteNotFound} from "~/components/NoteNotFound";

export const loader: LoaderFunction = async ({ params }) => {
	const noteId = params.noteId;

	if (!noteId) {
		throw new Response("Invalid note ID", { status: 400 });
	}

	await deleteExpiredNotes();

	const note = await prisma.note.findUnique({
		where: { id: noteId },
	});

	if (!note) {
		throw new Response("Note not found", { status: 404 });
	}

	return json({ note });
};

const NoteDetailPage = () => {
	const { note } = useLoaderData<typeof loader>();

	return (
		<>
			<div>{note ? <NoteDetail note={note} /> : <p>Note not found.</p>}</div>
			<Outlet />
		</>
	);
};

export const ErrorBoundary = () => (
	<GeneralErrorBoundary
		statusHandlers={{
			404: ({ params }) => <NoteNotFound noteId={params.noteId} />
		}}
	/>
);

export default NoteDetailPage;
