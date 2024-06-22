import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const noteId = formData.get("noteId")?.toString();

	if (!noteId) {
		return json({ error: "Invalid note ID" }, { status: 400 });
	}

	try {
		await prisma.note.delete({
			where: { id: noteId },
		});
		return json({ message: "Note deleted successfully" });
	} catch (error) {
		console.error("Error deleting note:", error);
		return json({ error: "Failed to delete note" }, { status: 500 });
	}
};
