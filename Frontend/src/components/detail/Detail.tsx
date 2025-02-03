import React, { useEffect, useState } from 'react';
import './detail.css';
import avatar from '../../assets/avatar.svg';
import { fetchProfile } from '../../request/api';
import { Profile as ProfileInterface } from '../../interface/Profile';
import Profile from '../profile/Profile'; // Import the Profile component

interface DetailProps {
  selectedChat: string | null;
  openChat: (username: string) => void; // Add the openChat function prop
}

const Detail: React.FC<DetailProps> = ({ selectedChat }) => {
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (selectedChat) {
        try {
          const profileData = await fetchProfile(selectedChat);
          setProfile(profileData);

        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [selectedChat]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}г.`;
  };

  const handleOpenProfile = () => {
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-container">
      <div className="header-detail"></div>
      <div className="avatar-container">
        <img src={profile.imgUrl ? `https://api.michat.pw/${profile.imgUrl}` : avatar} alt="img" />
      </div>
      <div className="user-details">
        <h2>{profile.name}</h2>
        <p>{profile.username}</p>
      </div>
      <div className="user-info">
        {profile.about_me && (
          <div className="item-info">
            <p className='title-info-text'>Обо мне</p>
            <p>{profile.about_me}</p>
          </div>
        )}
        {profile.registdate && (
          <div className="item-info">
            <p className='title-info-text'>Участник с</p>
            <p>{formatDate(profile.registdate)}</p>
          </div>
        )}
      </div>
      <div className="footer">
        <p onClick={handleOpenProfile}>Полный профиль</p>
      </div>
      <Profile
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        selectedChat={selectedChat}
      />
    </div>
  );
};

export default Detail;
