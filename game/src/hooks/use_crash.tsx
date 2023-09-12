import React, { createContext, useContext, useState } from "react";

interface ICrashContext {
    engineInitializationCrash?: Error;
    setEngineInitializationCrash(crash: Error | undefined): void;
}

const CrashContext = createContext<ICrashContext>({} as ICrashContext);

const CrashProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    const [engineInitializationCrash, setEngineInitializationCrash] = useState<Error>();

    return (
        <CrashContext.Provider value={{ engineInitializationCrash, setEngineInitializationCrash }}>
            { children }
        </CrashContext.Provider>
    );
};

function useCrash(): ICrashContext {
    return useContext(CrashContext);
}

export { CrashProvider, useCrash }