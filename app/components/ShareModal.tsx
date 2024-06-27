import React, { type FormEvent, useState } from "react";
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	ModalContent,
	Snippet,
} from "@nextui-org/react";
import { useNavigate, Link } from "@remix-run/react";
import styles from "./ShareModal.module.scss";

type ShareModalProps = {
	note: {
		id: string;
		title: string;
		content: string;
	};
	baseUrl: string;
};

const ShareModal = ({ note, baseUrl }: ShareModalProps) => {
	const [isOpen, setIsOpen] = useState(true);
	const navigate = useNavigate();

	const closeModal = () => {
		setIsOpen(false);
		navigate(`/notes/${note.id}`);
	};

	const handleShare = async (event: FormEvent) => {
		event.preventDefault();
		closeModal();
	};

	return (
		<Modal
			isOpen={isOpen}
			backdrop="blur"
			className={styles.modal}
			isDismissable
		>
			<ModalContent>
				<ModalHeader>Your private message link:</ModalHeader>
				<ModalBody>
					<Snippet
						symbol="🔗"
						className={styles.shareUrl}
						size="sm"
						variant="bordered"
					>
						{baseUrl}
					</Snippet>
				</ModalBody>
				<ModalFooter>
					<Link to="/">
						<Button color="primary" size="sm" variant="bordered">
							Go Home
						</Button>
					</Link>
					<Button
						color="success"
						variant="bordered"
						size="sm"
						onClick={handleShare}
					>
						View message
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ShareModal;
