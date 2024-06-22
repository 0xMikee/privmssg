import React, {useEffect, useState} from 'react';
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
    DateInput
} from "@nextui-org/react";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import styles from "./NoteDetail.module.scss";
import { parseAbsoluteToLocal } from "@internationalized/date";

type NoteDetailProps = {
    note: {
        id: string;
        title: string;
        content: string;
        expiryDate: string | null; // Handle null for viewing
        password?: string;
        shouldExpireAfterViewing: boolean; // New flag
    };
};

export const NoteDetail: React.FC<NoteDetailProps> = ({ note }) => {
    const [enteredPassword, setEnteredPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(!note.password);
    const [errorMessage, setErrorMessage] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(note.shouldExpireAfterViewing);
    const { isOpen, onClose } = useDisclosure({ isOpen: !!note.password });
    const navigate = useNavigate();
    const fetcher = useFetcher();

    useEffect(() => {
        const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');

        if (viewedNotes.includes(note.id) && note.shouldExpireAfterViewing) {
            fetcher.submit({ noteId: note.id }, { method: 'post', action: '/api/deleteNote' });
            navigate('/notes');
        }
    }, [note.id, note.shouldExpireAfterViewing, fetcher, navigate]);

    const handlePasswordSubmit = () => {
        if (note.password && enteredPassword === note.password) {
            setIsPasswordCorrect(true);
            onClose();
        } else {
            setErrorMessage('Incorrect password. Please try again.');
        }
    };

    const handleViewNote = () => {
        setIsConfirmOpen(false);

        if (note.shouldExpireAfterViewing) {
            const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
            localStorage.setItem('viewedNotes', JSON.stringify([...viewedNotes, note.id]));
        }
    };


    const safeOnClose = () => {
        setEnteredPassword('');
        setErrorMessage('');
        onClose();
    };

    return (
        <>
            {note.password && !isPasswordCorrect && (
                <Modal isOpen={isOpen} onClose={safeOnClose} backdrop="blur">
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
                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Link to="/notes">
                                    <Button color="danger" size="sm" variant="light" onPress={safeOnClose}>
                                        Close
                                    </Button>
                                </Link>
                                <Button color="primary" size="sm" onPress={handlePasswordSubmit}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
            )}

            {isConfirmOpen && (
                <Modal isOpen={isConfirmOpen} backdrop="blur">
                    <ModalContent>
                        <>
                            <ModalHeader>Confirm Viewing</ModalHeader>
                            <ModalBody>
                                <p>Viewing this note will delete it. Are you sure you want to proceed?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Link to="/notes">
                                    <Button color="danger" size="sm" variant="light" onPress={() => setIsConfirmOpen(true)}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button color="primary" size="sm" onClick={handleViewNote}>
                                    View Note
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
            )}

            {isPasswordCorrect && !isConfirmOpen && (
                <div className={styles.noteDetail}>
                    <Input readOnly label="Title" value={note.title} />
                    <Textarea readOnly label="Description" value={note.content} />
                    <Input
                        isReadOnly
                        label="Expires:"
                        placeholder="Now"
                    />
                </div>
            )}
        </>
    );
};
