import "./chatList.css";
import plus from '../../../assets/dark-theme-icon/plus.svg';
import avatar from '../../../assets/avatar.svg';
import { useState } from "react";

interface ChatListProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatList: React.FC<ChatListProps> = ({ setSelectedChat }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

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
        <div
          className={`item ${selectedItem === 'chat1' ? 'selected' : ''}`}
          onClick={() => handleChatSelect('chat1')}
        >
          <img src={avatar} alt="avatar" draggable="false" />
          <div className="texts">
            <span>Name</span>
            <p>hello</p>
          </div>
        </div>

        <div
          className={`item ${selectedItem === 'chat2' ? 'selected' : ''}`}
          onClick={() => handleChatSelect('chat2')}
        >
          <img src={avatar} alt="avatar" draggable="false"/>
          <div className="texts">
            <span>Name</span>
            <p>hello</p>
          </div>
        </div>

        <div
          className={`item ${selectedItem === 'chat3' ? 'selected' : ''}`}
          onClick={() => handleChatSelect('chat3')}
        >
          <img src={avatar} alt="avatar" draggable="false"/>
          <div className="texts">
            <span>Name</span>
            <p>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
