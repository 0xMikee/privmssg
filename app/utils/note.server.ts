import { prisma } from "~/utils/prisma.server";

export const deleteExpiredNotes = async () => {
	const now = new Date();

	try {
		await prisma.note.deleteMany({
			where: {
				expiryDate: {
					lte: now,
				},
			},
		});
	} catch (error) {
		console.error("Error deleting expired notes:", error);
	}
};
