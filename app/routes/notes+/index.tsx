import {Link, useLoaderData} from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import {Button} from "@nextui-org/react";

export const loader: LoaderFunction = async () => {
    const notes = await prisma.note.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return json({ notes });
};

export default function NotesIndex() {
    const { notes } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>Notes</h1>
            <Link to="/notes/new">Create New Note</Link>
            <ul>
                {notes.map((note) => (
                    <Link to={`/notes/${note.id}`} key={note.id}>
                        <Button size="sm" variant="bordered">{note.title}</Button>
                    </Link>
                ))}
            </ul>
        </div>
    );
}
