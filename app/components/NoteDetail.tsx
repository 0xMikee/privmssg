import type React from "react";
import { useEffect, useState } from "react";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import {
	useFetcher,
	useNavigate,
	useSearchParams,
} from "@remix-run/react";
import styles from "./NoteDetail.module.scss";

type NoteDetailProps = {
	note: {
		id: string;
		title: string;
		content: string;
		expiryDate: string | null;
		password?: string;
		shouldExpireAfterViewing: boolean;
	};
};

export const NoteDetail = ({ note }: NoteDetailProps) => {
	const [enteredPassword, setEnteredPassword] = useState("");
	const [isPasswordCorrect, setIsPasswordCorrect] = useState(!note.password);
	const [errorMessage, setErrorMessage] = useState("");
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isNoteVisible, setIsNoteVisible] = useState(!note.password && !note.shouldExpireAfterViewing);
	const { isOpen, onOpen, onClose } = useDisclosure({
		isOpen: !!note.password,
	});
	const navigate = useNavigate();
	const fetcher = useFetcher();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const viewedNotes = JSON.parse(localStorage.getItem("viewedNotes") || "[]");

		if (viewedNotes.includes(note.id) && note.shouldExpireAfterViewing) {
			fetcher.submit(
				{ noteId: note.id },
				{ method: "post", action: "/api/deleteNote" },
			);
		} else if (searchParams.get("created") === "true" && note.password) {
			onOpen();
		} else if (isPasswordCorrect && note.shouldExpireAfterViewing) {
			setIsConfirmOpen(true);
		} else if (isPasswordCorrect && !note.shouldExpireAfterViewing) {
			setIsNoteVisible(true);
		}
	}, [note.id, note.shouldExpireAfterViewing, isPasswordCorrect]);

	const handlePasswordSubmit = () => {
		if (note.password && enteredPassword === note.password) {
			setIsPasswordCorrect(true);
			onClose();
			if (note.shouldExpireAfterViewing) {
				setIsConfirmOpen(true);
			} else {
				setIsNoteVisible(true);
			}
		} else {
			setErrorMessage("Incorrect password. Please try again.");
		}
	};

	const handleViewNote = () => {
		setIsConfirmOpen(false);
		setIsNoteVisible(true);
		if (note.shouldExpireAfterViewing) {
			const viewedNotes = JSON.parse(
				localStorage.getItem("viewedNotes") || "[]",
			);
			localStorage.setItem(
				"viewedNotes",
				JSON.stringify([...viewedNotes, note.id]),
			);
		}
	};

	const safeOnClose = () => {
		setEnteredPassword("");
		setErrorMessage("");
		onClose();
		navigate("/notes");
	};

	return (
		<>
			{note.password && !isPasswordCorrect && (
				<Modal isOpen={isOpen} backdrop="blur" isDismissable className={styles.modal}>
					<ModalContent>
						<>
							<ModalHeader>Password Required</ModalHeader>
							<ModalBody>
								<Input
									label="Password"
									type="password"
									value={enteredPassword}
									onChange={(e) => setEnteredPassword(e.target.value)}
									placeholder="Enter password"
								/>
								{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									size="sm"
									variant="light"
									onPress={safeOnClose}
								>
									Close
								</Button>
								<Button
									color="success"
									size="sm"
									onPress={handlePasswordSubmit}
								>
									Submit
								</Button>
							</ModalFooter>
						</>
					</ModalContent>
				</Modal>
			)}

			{isConfirmOpen && isPasswordCorrect && !isNoteVisible && (
				<Modal isOpen={isConfirmOpen} backdrop="blur" className={styles.modal} isDismissable>
					<ModalContent>
						<>
							<ModalHeader>Confirm Viewing</ModalHeader>
							<ModalBody>
								<p>
									Viewing this message will delete it.
									<br/>
									Are you sure you want to proceed?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									size="sm"
									variant="light"
									onPress={safeOnClose}
								>
									Cancel
								</Button>
								<Button color="warning" variant="bordered" size="sm" onClick={handleViewNote}>
									View Note
								</Button>
							</ModalFooter>
						</>
					</ModalContent>
				</Modal>
			)}

			{isNoteVisible && (
				<div className={styles.noteDetail}>
					<Input readOnly={true} label="Title" value={note.title} />
					<Textarea readOnly={true} label="Description" value={note.content} />
					{note.shouldExpireAfterViewing ? (
						<Input isReadOnly={true} label="Expires:" placeholder="Now" color="warning" />
					) : (
						<Input
							color="warning"
							isReadOnly={true}
							label="Expires:"
							defaultValue={
								note.expiryDate
									? new Date(note.expiryDate).toLocaleString()
									: "Never"
							}
						/>
					)}
				</div>
			)}
		</>
	);
};
