import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface IConfirmationContext {
	confirmationQueue: ConfirmationRequestInfo[];
	enqueueConfirmation(alert: ConfirmationRequestInfo): void;
	getCurrentConfirmation(): ConfirmationRequestInfo | undefined;
}

export interface ConfirmationRequestInfo {
	title: string;
	description: string;

	confirmBtnText?: string;
	cancelBtnText?: string;

	onConfirm(): void;
	onCancel?(): void;
}

const ConfirmationContext = createContext<IConfirmationContext>({} as IConfirmationContext);

const ConfirmationProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const [confirmationQueue, setConfirmationQueue] = useState<ConfirmationRequestInfo[]>([]);

	const enqueueConfirmation = useCallback((alert: ConfirmationRequestInfo) => {
		setConfirmationQueue(queue => [...queue, alert]);
	}, []);

	const getCurrentConfirmation = useCallback(() => {
		if (confirmationQueue.length === 0) return undefined;
		const first = confirmationQueue[0];
		setConfirmationQueue([...confirmationQueue.slice(1)]);
		return first;
	}, [confirmationQueue]);

	const confirmationMemo = useMemo<IConfirmationContext>(() => {
		return {
			confirmationQueue,
			enqueueConfirmation,
			getCurrentConfirmation,
		};
	}, [confirmationQueue, enqueueConfirmation, getCurrentConfirmation]);

	return <ConfirmationContext.Provider value={confirmationMemo}>{children}</ConfirmationContext.Provider>;
};

function useConfirmation(): IConfirmationContext {
	return useContext(ConfirmationContext);
}

export { ConfirmationProvider, useConfirmation };
