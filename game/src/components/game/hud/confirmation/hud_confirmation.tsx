import React, { useCallback, useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton } from "@mui/material";
import { ConfirmationRequestInfo, useConfirmation } from "../../../../hooks/use_confirmation";
import { useTranslation } from "react-i18next";

const HUDConfirmation: React.FC = () => {

    const [ isOpen, setOpen ] = useState(false);
    const [ currentConfirmation, setCurrentConfirmation ] = useState<ConfirmationRequestInfo | undefined>();
    const { confirmationQueue, getCurrentConfirmation } = useConfirmation();
    const { t } = useTranslation(["common"]);

    useEffect(() => {
        if (!!currentConfirmation || confirmationQueue.length === 0) return;
        setCurrentConfirmation(getCurrentConfirmation());
    }, [currentConfirmation, confirmationQueue, getCurrentConfirmation]);

    useEffect(() => {
        setOpen(!!currentConfirmation);
    }, [currentConfirmation]);

    const handleClose = () => {
        setOpen(false);
        setCurrentConfirmation(undefined);
    };

    const confirm = useCallback(() => {
        currentConfirmation?.onConfirm();
        handleClose();
    }, [currentConfirmation]);

    const cancel = useCallback(() => {
        currentConfirmation?.onCancel?.();
        handleClose();
    }, [currentConfirmation]);

    return (
        <Dialog
            open={isOpen}
            onClose={cancel}
        >
            <DialogTitle>
                { currentConfirmation?.title ?? (<Skeleton variant="text" sx={{ fontSize: '1rem' }} />) }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    { currentConfirmation?.description ?? (<Skeleton variant="text" sx={{ fontSize: '1rem' }} />) }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} variant="text">{currentConfirmation?.cancelBtnText ?? t("common:cancel")}</Button>
                <Button onClick={confirm} variant="outlined">{currentConfirmation?.confirmBtnText ?? t("common:confirm")}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default HUDConfirmation;