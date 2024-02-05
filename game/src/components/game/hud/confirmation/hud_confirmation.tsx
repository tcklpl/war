import React, { useCallback, useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ConfirmationRequestInfo, useConfirmation } from "../../../../hooks/use_confirmation";

const HUDConfirmation: React.FC = () => {

    const [ isOpen, setOpen ] = useState(false);
    const [ currentConfirmation, setCurrentConfirmation ] = useState<ConfirmationRequestInfo | undefined>();
    const { confirmationQueue, getCurrentConfirmation } = useConfirmation();

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
        currentConfirmation?.onCancel();
        handleClose();
    }, [currentConfirmation]);

    return (
        <Dialog
            open={isOpen}
            onClose={cancel}
        >
            <DialogTitle>
                { currentConfirmation?.title }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    { currentConfirmation?.description }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} variant="text">Cancel</Button>
                <Button onClick={confirm} variant="outlined">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}

export default HUDConfirmation;