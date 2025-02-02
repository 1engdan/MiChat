import { useEffect, useRef, useState } from 'react';
import { fetchProfile, sendMessage as sendMessageApi } from '../../../../request/api';
import localAva from '../../../../assets/avatar.svg';
import { Profile } from '../../../../interface/Profile';
import './modalSearch.css';
import debounce from 'lodash.debounce';
import DarkSend from '../../../../assets/dark-theme-icon/sendMes.svg';
import LightSend from '../../../../assets/light-theme-icon/sendMes.svg';

interface ModalSearchProps {
    onClose: () => void;
    onChatAdded: (user: Profile) => void;
    existingChats: string[]; // Список имен пользователей, которые уже есть в чатах
}

const ModalSearch: React.FC<ModalSearchProps> = ({ onClose, onChatAdded, existingChats }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const send = isDarkTheme ? DarkSend : LightSend;
    const [username, setUsername] = useState('');
    const [userFound, setUserFound] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const updateTheme = () => {
            const bodyClass = document.body.classList.contains('dark') ? 'dark' : 'light';
            setIsDarkTheme(bodyClass === 'dark');
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleSearch = async (value: string) => {
        setLoading(true);
        try {
            const profile: Profile = await fetchProfile(value);
            setUserFound(profile);
        } catch (err) {
            setUserFound(null);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = debounce(handleSearch, 300);

    const handleInputChange = (value: string) => {
        setUsername(value);
        if (value.length > 0) {
            debouncedSearch(value);
        } else {
            setUserFound(null);
        }
    };

    const sendInitialMessage = async () => {
        if (userFound) {
            const recipientId = userFound.userId;
            const messageContent = message.trim();
            if (messageContent) {
                const messageData = {
                    recipient: recipientId,
                    content: messageContent,
                };

                try {
                    await sendMessageApi(messageData);
                    console.log('Initial message sent successfully');
                    onChatAdded(userFound); // Добавляем пользователя в список чатов
                    onClose(); // Закрываем модальное окно
                } catch (error) {
                    console.error('Error sending initial message:', error);
                }
            }
        }
    };

    const handleAddChat = () => {
        if (userFound) {
            if (existingChats.includes(userFound.username)) {
                onChatAdded(userFound); // Просто открываем чат с пользователем
                onClose(); // Закрываем модальное окно
            } else {
                sendInitialMessage(); // Отправляем сообщение и добавляем пользователя в список чатов
            }
        }
    };

    return (
        <div className="modal-container">
            <div className="content-search-modal">
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-header">
                    <h2>Поиск пользователя</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Введите имя пользователя"
                    />
                </div>
                <div className="modal-body">
                    {loading && <p>Поиск...</p>}
                    {userFound && (
                        <div className='profile-item-search'>
                            <div className="items-profile">
                                <img src={userFound?.imgUrl ? `http://localhost:8000/${userFound.imgUrl}` : localAva} alt="img" />
                                <div className="texts">
                                    <span>{userFound?.username}</span>
                                    <p>{userFound?.name}</p>
                                </div>
                            </div>
                            <div className="buttons-search">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Введите сообщение"
                                    ref={inputRef}
                                />
                                <img src={send} alt="" draggable="false" onClick={handleAddChat}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalSearch;
