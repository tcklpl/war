import { create } from 'zustand';

export interface ConfirmationRequestInfo {
	title: string;
	description: string;

	confirmBtnText?: string;
	cancelBtnText?: string;

	onConfirm(): void;
	onCancel?(): void;
}

export interface ConfirmationRequestStore {
	confirmationQueue: ConfirmationRequestInfo[];
	enqueueConfirmation(confirmation: ConfirmationRequestInfo): void;
	dequeueConfirmation(): ConfirmationRequestInfo | undefined;
}

export const useConfirmationStore = create<ConfirmationRequestStore>()((set, get) => ({
	confirmationQueue: [],
	enqueueConfirmation: confirmation => set({ confirmationQueue: [...get().confirmationQueue, confirmation] }),
	dequeueConfirmation: () => {
		const { confirmationQueue } = get();
		if (confirmationQueue.length === 0) return undefined;

		const first = confirmationQueue[0];
		set({ confirmationQueue: confirmationQueue.slice(1) });
		return first;
	},
}));
