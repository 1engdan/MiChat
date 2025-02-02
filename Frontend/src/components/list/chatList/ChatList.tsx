import React, { useState, useEffect } from 'react';
import ItemList from './itemList/ItemList';
import './chatList.css';
import plus from '../../../assets/dark-theme-icon/plus.svg';
import { fetchChats, fetchProfile, sendMessage } from '../../../request/api';
import { Chat } from '../../../interface/Chat';
import { Profile } from '../../../interface/Profile';
import ModalSearch from './ModalSearch/ModalSearch'; // Импортируем модальное окно поиска

interface ChatListProps {
    setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatList: React.FC<ChatListProps> = ({ setSelectedChat }) => {
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [items, setItems] = useState<{ id: string; avatar: string | null; name: string; }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Получаем список имен пользователей, которые уже есть в чатах
    const existingChats = items.map((item) => item.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chats: Chat[] = await fetchChats();
                const itemsPromises = chats.map(async (chat) => {
                    const profile: Profile = await fetchProfile(chat.username);
                    return {
                        id: chat.username,
                        avatar: profile.imgUrl,
                        name: profile.name,
                    };
                });

                const items = await Promise.all(itemsPromises);
                setItems(items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChatSelect = (id: string) => {
        setSelectedItem(id);
        setSelectedChat(id); // Передаем выбранный чат в родительский компонент
    };

    const handleAddChat = async (user: Profile) => {
        // Если пользователь уже есть в списке, просто открываем чат с ним
        if (existingChats.includes(user.username)) {
            setSelectedChat(user.username);
            setIsModalOpen(false); // Закрываем модальное окно
            return;
        }

        // Если пользователя нет в списке, добавляем его
        setItems((prevItems) => [
            ...prevItems,
            {
                id: user.username,
                avatar: user.imgUrl,
                name: user.name,
            },
        ]);
        setSelectedChat(user.username); // Открываем чат с новым пользователем
        setIsModalOpen(false); // Закрываем модальное окно

        // Отправляем сообщение
        await sendInitialMessage(user.username);
    };

    const sendInitialMessage = async (recipientId: string) => {
        const message = {
            recipient: recipientId,
            content: '...',
        };

        try {
            await sendMessage(message);
            console.log('Initial message sent successfully');
        } catch (error) {
            console.error('Error sending initial message:', error);
        }
    };

    return (
        <div className="chatList">
            <div className="title-chat">
                <p>Личные сообщения</p>
                <img src={plus} alt="icon" onClick={() => setIsModalOpen(true)} />
            </div>
            <div className="list-items">
                {items.length > 0 ? (
                    items.map((item) => (
                        <ItemList
                            key={item.id}
                            id={item.id}
                            avatar={item.avatar}
                            name={item.name}
                            selectedItem={selectedItem}
                            handleChatSelect={handleChatSelect}
                        />
                    ))
                ) : (
                    <div className="empty-message">Пусто:(</div>
                )}
            </div>
            {isModalOpen && (
                <ModalSearch
                    onClose={() => setIsModalOpen(false)}
                    onChatAdded={handleAddChat}
                    existingChats={existingChats} // Передаем список существующих чатов
                />
            )}
        </div>
    );
};

export default ChatList;
