import React from 'react';
import './notification.css'; // Создайте файл стилей для уведомления

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    return (
        <div className="notification">
            <p>{message}</p>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default Notification;
