import React, { useEffect, useState } from 'react';
import './chat.css';

import DarkOffProfile from '../../assets/dark-theme-icon/profile.svg';
import DarkSend from '../../assets/dark-theme-icon/sendMes.svg';
import DarkFile from '../../assets/dark-theme-icon/addFile.svg';

import LightOffProfile from '../../assets/light-theme-icon/profile.svg';
import LightSend from '../../assets/light-theme-icon/sendMes.svg';
import LightFile from '../../assets/light-theme-icon/addFile.svg';

import avatar from '../../assets/avatar.svg';

interface ChatProps {
  selectedChat: string | null;
}

const Chat: React.FC<ChatProps> = ({ selectedChat }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  useEffect(() => {
      const updateTheme = () => {
        const bodyClass = document.body.classList.contains('dark') ? 'dark' : 'light';
        setIsDarkTheme(bodyClass === 'dark');
      };
  
      // Initial check
      updateTheme();
  
      // Add event listener for class changes
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  
      // Cleanup on component unmount
      return () => {
        observer.disconnect();
      };
    }, []);
  const profile = isDarkTheme ? DarkOffProfile : LightOffProfile;
  const send = isDarkTheme ? DarkSend : LightSend;
  const file = isDarkTheme ? DarkFile : LightFile;


  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <p>Name</p>
        </div>
        <div className="icons">
          <img src={profile} alt="info" draggable="false"/>
        </div>
      </div>

      <div className="center">
        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message own">
          <div className="texts">
            <img src={avatar} alt="ava" />
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <img src={avatar} alt="ava" />

            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message own">
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>

        <div className="message">
          <img src={avatar} alt="ava" />
          <div className="texts">
            <p>
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
              <span>15:19</span>
            </div> 
        </div>
      </div>

      <div className="bottom">
        <div className="icons">
          <img src={file} alt="" draggable="false"/>
        </div>
        <input type="text" placeholder='Написать @{username}'/>
        <div className="right-icons">
          <img src={send} alt="" draggable="false"/>
        </div>
      </div>
{/*     {selectedChat ? ( 
        <div className="chat-content">
          <p>Содержимое чата: {selectedChat}</p>
        </div>
      ) : (
        <div className="no-chat-selected">
          <p>Выберите, кому хотели бы написать</p>
        </div>
      )}
*/}
    </div>
  );
};

export default Chat;