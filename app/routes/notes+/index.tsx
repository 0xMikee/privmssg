import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import NotePage from "~/components/NotePage";

export const loader: LoaderFunction = async () => {
	const notes = await prisma.note.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return json({ notes });
};

const NotesIndex = () => {
	const { notes } = useLoaderData<typeof loader>();

	return /*<NotePage notes={notes} />*/;
};

export default NotesIndex;
