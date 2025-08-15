import { create } from 'zustand';

export interface AlertInfo {
	title?: string;
	content: string;

	confirmationButtonText?: string;
}

export interface AlertStore {
	alertQueue: AlertInfo[];
	enqueueAlert: (alert: AlertInfo) => void;
	dequeueAlert: () => AlertInfo | undefined;
}

export const useAlertStore = create<AlertStore>()((set, get) => ({
	alertQueue: [],
	enqueueAlert: alert => set(state => ({ alertQueue: [...state.alertQueue, alert] })),
	dequeueAlert: () => {
		const { alertQueue } = get();
		if (alertQueue.length === 0) return undefined;

		const first = alertQueue[0];
		set({ alertQueue: alertQueue.slice(1) });
		return first;
	},
}));
