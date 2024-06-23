import { json, type LoaderFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { useLoaderData } from "@remix-run/react";
import ShareModal from "~/components/ShareModal";

export const loader: LoaderFunction = async ({ params, request }) => {
    const noteId = params.noteId;

    if (!noteId) {
        throw new Response("Invalid note ID", { status: 400 });
    }

    const note = await prisma.note.findUnique({
        where: { id: noteId },
    });

    if (!note) {
        throw new Response("Note not found", { status: 404 });
    }

    const url = new URL(request.url);
    const baseUrl = `${url.origin}/notes/${noteId}`;

    return json({ note, baseUrl });
};

const ShareNotePage = () => {
    const { note, baseUrl } = useLoaderData<typeof loader>();
    return <ShareModal note={note} baseUrl={baseUrl} />;
}

export default ShareNotePage;