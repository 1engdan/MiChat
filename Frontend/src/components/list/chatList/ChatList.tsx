import React, { useState, useEffect } from 'react';
import ItemList from './itemList/ItemList';
import './chatList.css';
import plus from '../../../assets/dark-theme-icon/plus.svg';
import { fetchChats, fetchProfile } from '../../../request/api';
import { Chat } from '../../../interface/Chat';
import { Profile } from '../../../interface/Profile';

interface ChatListProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatList: React.FC<ChatListProps> = ({ setSelectedChat }) => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [items, setItems] = useState<{ id: string; avatar: string | null; name: string; }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем список чатов
        const chats: Chat[] = await fetchChats();

        // Получаем данные для каждого чата
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

  return (
    <div className="chatList">
      <div className="title-chat">
        <p>Личные сообщения</p>
        <img src={plus} alt="icon" />
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
    </div>
  );
};

export default ChatList;
