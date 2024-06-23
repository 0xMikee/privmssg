import React, { type FormEvent, useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    ModalContent
} from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
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

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(baseUrl);
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
    };

    return (
        <Modal isOpen={isOpen} backdrop="blur" className={styles.modal} isDismissable>
            <ModalContent>
                <>
                    <ModalHeader>Your private message link:</ModalHeader>
                    <ModalBody>
                        <Input readOnly variant="bordered" placeholder={baseUrl}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            size="sm"
                            onClick={copyToClipboard}
                            variant="bordered"
                        >
                            Copy Link
                        </Button>
                        <Button
                            color="success"
                            variant="bordered"
                            size="sm"
                            onClick={handleShare}
                        >
                            View message
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
};

export default ShareModal;
