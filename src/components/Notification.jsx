import { useNotification } from "../context/NotificationContext";

function Notification() {
    const { notification } = useNotification();

    if (!notification) return null;

    const styles = {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        padding: "12px 20px",
        borderRadius: "6px",
        color: "white",
        fontWeight: "bold",
        minWidth: "250px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        backgroundColor:
            notification.type === "success"
                ? "#28a745"
                : "#dc3545",
    };

    return (
        <div style={styles}>
            {notification.message}
        </div>
    );
}

export default Notification;