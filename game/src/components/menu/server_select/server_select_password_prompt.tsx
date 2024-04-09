import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react"
import "./server_select.scss";
import { useTranslation } from "react-i18next";

const ServerSelectPasswordPrompt: React.FC<{
    open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onPasswordSet: (password?: string) => void
}> = ({ open, setOpen, onPasswordSet }) => {

    const [password, setPassword] = useState("");
    const { t } = useTranslation(["server_list"]);

    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        setPassword("");
        setPasswordError("");
    }, [open]);

    const validate = useCallback(() => {

        setPasswordError("");

        const trimmedPassword = password.trim();

        if (!trimmedPassword) {
            setPasswordError(t("server_list:password_prompt_error_no_password"));
            return;
        }

        onPasswordSet(trimmedPassword);
        setOpen(false);

    }, [t, password, setOpen, onPasswordSet]);

    return (
        <Dialog open={open} PaperProps={{
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                validate();
            }
        }}>
            <DialogTitle>{ t("server_list:password_prompt_title") }</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <DialogContentText>
                        { t("server_list:password_prompt_desc") }
                    </DialogContentText>
                    <TextField 
                        id="server-name" 
                        label="Password" 
                        onChange={e => setPassword(e.currentTarget.value)} 
                        required
                        value={password} 
                        error={!!passwordError} helperText={passwordError} 
                        type="password"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => validate()}>{ t("server_list:connect") }</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ServerSelectPasswordPrompt;