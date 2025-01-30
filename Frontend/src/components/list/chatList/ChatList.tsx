import "./chatList.css";
import plus from '../../../assets/dark-theme-icon/plus.svg';
import { useState, useEffect } from "react";
import { getUsersWithChats } from '../../../request/api';
import { ChatData } from '../../../enum/apiTypes'; // Импортируйте интерфейс

interface ChatListProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ChatItemProps {
  chat: ChatData;
  selectedItem: string | null;
  handleChatSelect: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, selectedItem, handleChatSelect }) => {
  return (
    <div
      className={`item ${selectedItem === chat.chatId ? 'selected' : ''}`}
      onClick={() => handleChatSelect(chat.chatId)}
    >
      <img src={chat.avatarUrl} alt="avatar" draggable="false" />
      <div className="texts">
        <span>{chat.name}</span>
        <p>{chat.lastMessage}</p>
      </div>
    </div>
  );
};

const ChatList: React.FC<ChatListProps> = ({ setSelectedChat }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatData[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getUsersWithChats();
        setChats(response.data.data || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chatId: string) => {
    setSelectedItem(chatId);
    setSelectedChat(chatId);
  };

  return (
    <div className="chatList">
      <div className="title-chat">
        <p>Личные сообщения</p>
        <img
          src={plus}
          alt="plus"
          onClick={() => {}}
        />
      </div>
      <div className="list-items">
        {chats.map(chat => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            selectedItem={selectedItem}
            handleChatSelect={handleChatSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
