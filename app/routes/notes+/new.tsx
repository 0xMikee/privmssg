import { redirect } from "@remix-run/node";
import React from "react";
import NoteForm from "~/components/NoteForm";
import { prisma } from "~/utils/prisma.server";
import type { ActionFunction } from "@remix-run/node";

const getExpirationDate = (duration: string) => {
	const now = new Date();
	switch (duration) {
		case "viewing":
			return null; // Return null for viewing
		case "1hr":
			return new Date(now.getTime() + 60 * 60 * 1000);
		case "5hrs":
			return new Date(now.getTime() + 5 * 60 * 60 * 1000);
		case "1day":
			return new Date(now.getTime() + 24 * 60 * 60 * 1000);
		case "1week":
			return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		default:
			return now;
	}
};

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
		return redirect(`/notes/${note.id}`);
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
