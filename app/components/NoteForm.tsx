import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/select';
import { Icon, IconId } from '~/components/Icon';
import { Form } from '@remix-run/react';
import styles from './NoteForm.module.scss';

const NoteForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [expiration, setExpiration] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        const isFormValid = title.trim() !== '' && description.trim() !== '' && expiration !== '';
        setButtonDisabled(!isFormValid);
    }, [title, description, expiration]);

    return (
        <Form method="post" className={styles.noteForm}>
            <Input
                type="text"
                name="title"
                label="Title"
                size="sm"
                variant="bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Textarea
                required
                size="sm"
                name="description"
                label="Description"
                variant="bordered"
                value={description}
                className={styles.textArea}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Input
                type="password"
                name="password"
                label="Password (optional)"
                size="sm"
                variant="bordered"
                value={password}
                className={styles.passwordInput}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Select
                required
                size="sm"
                name="expires_after"
                label="Expires after:"
                className={styles.select}
                placeholder="Select expiration time"
                startContent={<Icon id={IconId.TIME} width={20} height={20} />}
                onSelectionChange={(selectedKeys) => {
                    const selectedKey = Array.from(selectedKeys).join('');
                    setExpiration(selectedKey);
                }}
            >
                <SelectItem key="viewing" value="viewing">Viewing</SelectItem>
                <SelectItem key="1hr" value="1hr">1 Hour</SelectItem>
                <SelectItem key="5hrs" value="5hrs">5 Hours</SelectItem>
                <SelectItem key="1day" value="1day">1 Day</SelectItem>
                <SelectItem key="1week" value="1week">1 Week</SelectItem>
            </Select>
            <Button
                type="submit"
                size="sm"
                color="success"
                isDisabled={isButtonDisabled}
                variant="flat"
            >
                Generate link
            </Button>
        </Form>
    );
};

export default NoteForm;
