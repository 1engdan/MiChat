import React from 'react';
import './chatMessages.css';

interface ChatMessagesProps {
  messages: { content: string; time: string; sender: string }[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender === 'me' ? 'own' : 'nwo'}`}>
          <div className="texts">
            <p>{message.content}</p>
            <span>{message.time}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
