import React, { useState } from 'react';
import './chat.css';

interface ChatProps {
  selectedChat: string | null;
}

const Chat: React.FC<ChatProps> = ({ selectedChat }) => {
  return (
    <div className="chat">
      {selectedChat ? (
        <div className="chat-content">
          {/* Здесь будет отображаться содержимое выбранного чата */}
          <p>Содержимое чата: {selectedChat}</p>
        </div>
      ) : (
        <div className="no-chat-selected">
          <p>Выберите, кому хотели бы написать</p>
        </div>
      )}
    </div>
  );
};

export default Chat;