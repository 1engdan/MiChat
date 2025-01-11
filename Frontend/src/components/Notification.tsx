import React, { useEffect, useState } from 'react';
import './notification.css';

interface NotificationProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, show, onClose }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div className={`notification ${visible ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Notification;
