import React, { useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { IAlertInfo, useAlert } from "../../../../hooks/use_alert";

const HUDAlert: React.FC = () => {

    const [ isOpen, setOpen ] = useState(false);
    const [ currentAlert, setCurrentAlert ] = useState<IAlertInfo | undefined>();
    const { alertQueue, getAlert } = useAlert();

    useEffect(() => {
        if (!!currentAlert || alertQueue.length === 0) return;
        setCurrentAlert(getAlert());
    }, [currentAlert, alertQueue, getAlert]);

    useEffect(() => {
        setOpen(!!currentAlert);
    }, [currentAlert]);

    const handleClose = () => {
        setOpen(false);
        setCurrentAlert(undefined);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle>
                { currentAlert?.title }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    { currentAlert?.content }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Understood</Button>
            </DialogActions>
        </Dialog>
    );
}

export default HUDAlert;