import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { deleteExpiredNotes } from "~/utils/note.server";
import { NoteDetail } from "~/components/NoteDetail";

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

export default function NoteDetailPage() {
    const { note } = useLoaderData<typeof loader>();

    return (
        <div>
            {note ? <NoteDetail note={note} /> : <p>Note not found.</p>}
        </div>
    );
}
