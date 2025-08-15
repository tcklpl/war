import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ConfirmationRequestInfo, useConfirmationStore } from '../../state/confirmation.store';

const HUDConfirmation: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [currentConfirmation, setCurrentConfirmation] = useState<ConfirmationRequestInfo | undefined>();
	const confirmationQueue = useConfirmationStore(state => state.confirmationQueue);
	const dequeueConfirmation = useConfirmationStore(state => state.dequeueConfirmation);
	const { t } = useTranslation(['common']);

	useEffect(() => {
		if (!!currentConfirmation || confirmationQueue.length === 0) return;
		setCurrentConfirmation(dequeueConfirmation());
	}, [currentConfirmation, confirmationQueue, dequeueConfirmation]);

	useEffect(() => {
		setOpen(!!currentConfirmation);
	}, [currentConfirmation]);

	const handleClose = useCallback(() => {
		setOpen(false);
		setTimeout(() => setCurrentConfirmation(undefined), 500);
	}, []);

	const confirm = useCallback(() => {
		currentConfirmation?.onConfirm();
		handleClose();
	}, [currentConfirmation, handleClose]);

	const cancel = useCallback(() => {
		currentConfirmation?.onCancel?.();
		handleClose();
	}, [currentConfirmation, handleClose]);

	return (
		<Dialog open={open} onClose={cancel}>
			<DialogTitle>{currentConfirmation?.title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{currentConfirmation?.description}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancel} variant='text'>
					{currentConfirmation?.cancelBtnText ?? t('common:cancel')}
				</Button>
				<Button onClick={confirm} variant='outlined'>
					{currentConfirmation?.confirmBtnText ?? t('common:confirm')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default HUDConfirmation;
