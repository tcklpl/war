import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertInfo, useAlertStore } from '../../state/alert.store';

const HUDAlert: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [currentAlert, setCurrentAlert] = useState<AlertInfo | undefined>();
	const alertQueue = useAlertStore(state => state.alertQueue);
	const dequeueAlert = useAlertStore(state => state.dequeueAlert);
	const { t } = useTranslation(['common']);

	useEffect(() => {
		if (!!currentAlert || alertQueue.length === 0) return;
		setCurrentAlert(dequeueAlert());
	}, [currentAlert, alertQueue, dequeueAlert]);

	useEffect(() => {
		setOpen(!!currentAlert);
	}, [currentAlert]);

	const handleClose = () => {
		setOpen(false);
		setTimeout(() => setCurrentAlert(undefined), 500);
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>{currentAlert?.title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{currentAlert?.content}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{currentAlert?.confirmationButtonText ?? t('common:understood')}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default HUDAlert;
