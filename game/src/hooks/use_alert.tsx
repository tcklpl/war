import React, { createContext, useCallback, useContext, useState } from "react";

interface IAlertContext {
    alertQueue: IAlertInfo[];
    enqueueAlert(alert: IAlertInfo): void;
    getAlert(): IAlertInfo | undefined;
}

export interface IAlertInfo {
    title?: string;
    content: string;
}

const AlertContext = createContext<IAlertContext>({} as IAlertContext);

const AlertProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

    const [alertQueue, setAlertQueue] = useState<IAlertInfo[]>([]);

    const enqueueAlert = useCallback((alert: IAlertInfo) => {
        setAlertQueue(queue => [...queue, alert]);
    }, [setAlertQueue]);

    const getAlert = useCallback(() => {
        if (alertQueue.length === 0) return undefined;
        const first = alertQueue[0];
        setAlertQueue([...alertQueue.slice(1)]);
        return first;
    }, [alertQueue]);

    return (
        <AlertContext.Provider value={{ alertQueue, enqueueAlert, getAlert }}>
            { children }
        </AlertContext.Provider>
    );
};

function useAlert(): IAlertContext {
    return useContext(AlertContext);
}

export { AlertProvider, useAlert }