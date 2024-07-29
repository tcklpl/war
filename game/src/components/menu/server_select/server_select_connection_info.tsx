import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import React, { useCallback } from 'react';
import './server_select.scss';
import { useTranslation } from 'react-i18next';
import { ServerListEntry } from './server_list_entry';

const ServerSelectConnectionInfo: React.FC<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    server?: ServerListEntry;
    title: string;
    serverConMessage: string;
    closeable: boolean;
}> = ({ open, setOpen, server, title, serverConMessage, closeable }) => {
    const { t } = useTranslation(['server_list']);

    const close = useCallback(() => {
        if (!closeable) return;
        setOpen(false);
    }, [closeable, setOpen]);

    return (
        <Dialog open={open} onClose={() => close()}>
            {server && (
                <>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={1}>
                            <DialogContentText>{serverConMessage}</DialogContentText>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        {closeable && <Button onClick={() => close()}>{t('server_list:close')}</Button>}
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default ServerSelectConnectionInfo;
