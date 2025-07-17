import type React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

interface ICrashContext {
	engineInitializationCrash?: Error;
	setEngineInitializationCrash(crash: Error | undefined): void;
}

const CrashContext = createContext<ICrashContext>({} as ICrashContext);

const CrashProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const [engineInitializationCrash, setEngineInitializationCrash] = useState<Error>();

	const crashMemo = useMemo<ICrashContext>(() => {
		return {
			engineInitializationCrash,
			setEngineInitializationCrash,
		};
	}, [engineInitializationCrash]);

	return <CrashContext.Provider value={crashMemo}>{children}</CrashContext.Provider>;
};

function useCrash(): ICrashContext {
	return useContext(CrashContext);
}

export { CrashProvider, useCrash };
