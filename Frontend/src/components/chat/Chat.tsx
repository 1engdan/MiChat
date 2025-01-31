import React, { useEffect, useRef, useState } from 'react';
import './chat.css';

import DarkOffProfile from '../../assets/dark-theme-icon/profile.svg';
import DarkSend from '../../assets/dark-theme-icon/sendMes.svg';
import DarkFile from '../../assets/dark-theme-icon/addFile.svg';

import LightOffProfile from '../../assets/light-theme-icon/profile.svg';
import LightSend from '../../assets/light-theme-icon/sendMes.svg';
import LightFile from '../../assets/light-theme-icon/addFile.svg';

import { fetchMessages, fetchProfile, sendMessage as sendMessageApi } from '../../request/api';
import { Message } from '../../interface/Message';
import ChatMessages from './chatMessages/ChatMessages';

interface ChatProps {
  selectedChat: string | null;
}

const Chat: React.FC<ChatProps> = ({ selectedChat }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [messages, setMessages] = useState<{ content: string; time: string; sender: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatUsername, setChatUsername] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (selectedChat) {
        try {
          const messages: Message[] = await fetchMessages(selectedChat);
          const accessToken = localStorage.getItem('access_token');
          const userId = accessToken ? JSON.parse(atob(accessToken.split('.')[1])).userId : null;
          setUserId(userId);

          const formattedMessages = messages.map(message => ({
            content: message.message,
            time: new Date(message.datecreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: message.senderId === userId ? 'me' : 'other'
          }));
          setMessages(formattedMessages);

          const userDetails = await fetchProfile(selectedChat);
          setChatUsername(userDetails.username);
          setRecipientId(userDetails.userId);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchChatMessages();
  }, [selectedChat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior:"smooth"})
  })
  useEffect(() => {
    const connectWebSocket = () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken && chatUsername) {
        const userId = JSON.parse(atob(accessToken.split('.')[1])).userId;
        const ws = new WebSocket(`ws://localhost:8000/chat/ws/${chatUsername}`);

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          console.log('Received message:', event.data);
          const message = JSON.parse(event.data);
          const formattedMessage = {
            content: message.content,
            time: new Date(message.datecreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: message.senderId === userId ? 'me' : 'other'
          };
          setMessages(prevMessages => [...prevMessages, formattedMessage]);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };

        setSocket(ws);
      }
    };

    if (userId && chatUsername) {
      connectWebSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [selectedChat, userId, chatUsername]);

  const sendMessage = async () => {
    if (recipientId && userId && inputRef.current) {
      const messageText = inputRef.current.value;
      if (messageText.trim()) {
        const message = {
          recipient: recipientId,
          content: messageText
        };
        console.log('Sending message:', message);

        try {
          const response = await sendMessageApi(message);
          console.log('Message sent successfully:', response);
          inputRef.current.value = '';

          const formattedMessage = {
            content: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me'
          };
          setMessages(prevMessages => [...prevMessages, formattedMessage]);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const profile = isDarkTheme ? DarkOffProfile : LightOffProfile;
  const send = isDarkTheme ? DarkSend : LightSend;
  const file = isDarkTheme ? DarkFile : LightFile;

  return (
    <div className="chat">
      {selectedChat ? (
        <>
          <div className="top">
            <div className="user">
              <p>{chatUsername}</p>
            </div>
            <div className="icons">
              <img src={profile} alt="info" draggable="false" />
            </div>
          </div>

          <div className="center">
            <div className="chat-messages">
              <ChatMessages messages={messages} />
            </div>
            <div ref={endRef}></div>
          </div>

          <div className="bottom">
            <div className="icons">
              <img src={file} alt="" draggable="false" />
            </div>
            <input
              type="text"
              placeholder={`Написать @${chatUsername}`}
              onKeyPress={handleInputKeyPress}
              ref={inputRef}
            />
            <div className="right-icons">
              <img src={send} alt="" draggable="false" onClick={sendMessage}/>
            </div>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">
          <p>Выберите, кому хотели бы написать</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
