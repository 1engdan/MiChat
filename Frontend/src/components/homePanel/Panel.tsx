import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './panel.css';

import OnChat from '../../assets/onIcon/onChat.svg';
import OnStg from '../../assets/onIcon/onSettin.svg';

import DarkOffChat from '../../assets/dark-theme-icon/offChat.svg';
import DarkOffStg from '../../assets/dark-theme-icon/offSettin.svg';
import DarkProfile from '../../assets/dark-theme-icon/profile.svg';

import LightOffChat from '../../assets/light-theme-icon/offChat.svg';
import LightOffStg from '../../assets/light-theme-icon/offSettin.svg';
import LightProfile from '../../assets/light-theme-icon/profile.svg';

import Profile from '../profile/Profile'; // Import the Profile component
import { fetchUsername } from '../../request/api'; // Import the fetchUsername function

const Panel: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/chats') {
      setIsChatActive(true);
    } else {
      setIsChatActive(false);
    }

    if (location.pathname === '/settings') {
      setIsSettingsActive(true);
    } else {
      setIsSettingsActive(false);
    }
  }, [location]);

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

  const handleChatClick = () => {
    navigate('/chats');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleProfileClick = async () => {
    setIsProfileOpen(true);
    // Extract user ID from token and set it to selectedChat
    const token = localStorage.getItem('access_token'); // Assuming the token is stored in localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to get user ID
      const userId = decodedToken.userId;
      try {
        const username = await fetchUsername(userId);
        setSelectedChat(username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    }
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  const offChat = isDarkTheme ? DarkOffChat : LightOffChat;
  const offStg = isDarkTheme ? DarkOffStg : LightOffStg;
  const profile = isDarkTheme ? DarkProfile : LightProfile;

  return (
    <div className="panel">
      <img
        src={isChatActive ? OnChat : offChat}
        alt="chat"
        onClick={handleChatClick}
        draggable="false"
      />
      <img
        src={profile}
        alt="profile"
        draggable="false"
        onClick={handleProfileClick}
      />
      <img
        src={isSettingsActive ? OnStg : offStg}
        alt="settings"
        onClick={handleSettingsClick}
        draggable="false"
      />
      <Profile isOpen={isProfileOpen} onClose={handleProfileClose} selectedChat={selectedChat} />
    </div>
  );
};

export default Panel;
