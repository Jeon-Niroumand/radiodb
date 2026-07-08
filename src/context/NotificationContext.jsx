import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showSuccess = (message) => {
        setNotification({
            type: "success",
            message,
        });
    };

    const showError = (message) => {
        setNotification({
            type: "error",
            message,
        });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [notification]);

    return (
        <NotificationContext.Provider
            value={{
                notification,
                showSuccess,
                showError,
                clearNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}