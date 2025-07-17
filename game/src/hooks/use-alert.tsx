import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface IAlertContext {
	alertQueue: IAlertInfo[];
	enqueueAlert(alert: IAlertInfo): void;
	getAlert(): IAlertInfo | undefined;
}

export interface IAlertInfo {
	title?: string;
	content: string;

	understoodBtnText?: string;
}

const AlertContext = createContext<IAlertContext>({} as IAlertContext);

const AlertProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const [alertQueue, setAlertQueue] = useState<IAlertInfo[]>([]);

	const enqueueAlert = useCallback((alert: IAlertInfo) => {
		setAlertQueue(queue => [...queue, alert]);
	}, []);

	const getAlert = useCallback(() => {
		if (alertQueue.length === 0) return undefined;
		const first = alertQueue[0];
		setAlertQueue([...alertQueue.slice(1)]);
		return first;
	}, [alertQueue]);

	const alertMemo = useMemo<IAlertContext>(() => {
		return {
			alertQueue,
			enqueueAlert,
			getAlert,
		};
	}, [alertQueue, enqueueAlert, getAlert]);

	return <AlertContext.Provider value={alertMemo}>{children}</AlertContext.Provider>;
};

function useAlert(): IAlertContext {
	return useContext(AlertContext);
}

export { AlertProvider, useAlert };
