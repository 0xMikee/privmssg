import { redirect } from "@remix-run/node";
import NoteForm from "~/components/NoteForm";
import { prisma } from "~/utils/prisma.server";
import type { ActionFunction } from "@remix-run/node";
import {getExpirationDate} from "~/utils/getExpirationDate";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const title = formData.get("title")?.toString();
	const description = formData.get("description")?.toString();
	const password = formData.get("password")?.toString() || null;
	const expiration = formData.get("expires_after")?.toString();

	if (!title || !description || !expiration) {
		return new Response("Missing fields", { status: 400 });
	}

	const expiryDate = getExpirationDate(expiration);
	const shouldExpireAfterViewing = expiration === "viewing";

	try {
		const note = await prisma.note.create({
			data: {
				title,
				content: description,
				expiryDate,
				password,
				shouldExpireAfterViewing,
			},
		});

		return redirect(`/notes/${note.id}/share`);
	} catch (error) {
		console.error("Error creating note:", error);
		return new Response("Failed to create note", { status: 500 });
	}
};

export default function NewNote() {
	return (
		<div>
			<h1>New Note</h1>
			<NoteForm />
		</div>
	);
}