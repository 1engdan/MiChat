import './profile.css';
import avatar from '../../assets/avatar.svg';
import React, { useEffect, useState } from 'react';
import { fetchProfile, fetchImage } from '../../request/api';
import { Profile as ProfileInterface } from '../../interface/Profile';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: string | null;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose, selectedChat }) => {
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (selectedChat) {
        try {
          const profileData = await fetchProfile(selectedChat);
          setProfile(profileData);

          const avatarBlob = await fetchImage(selectedChat);
          const avatarUrl = URL.createObjectURL(avatarBlob);
          setAvatarUrl(avatarUrl);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [selectedChat]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}г.`;
  };

  if (!isOpen) return null;

  return (
    <div className="profile-container" onClick={handleOverlayClick}>
      <div className="profile-content" onClick={e => e.stopPropagation()}>
        <div className="header-detail"></div>
        <div className="avatar-container">
          <img src={avatarUrl || avatar} alt="Avatar" />
        </div>
        <div className="user-details">
          {profile ? (
            <div className="user-detail">
              <h2>{profile.name}</h2>
              <p>{profile.username}</p>
            </div>
          ) : (
            <div className="user-detail">
              <h2>Loading...</h2>
            </div>
          )}
        </div>
        <div className="user-info-container">
          <div className="user-info">
            {profile && profile.about_me && (
              <div className="item-info">
                <p className='title-info-text'>Обо мне</p>
                <p>{profile.about_me}</p>
              </div>
            )}
            {profile && profile.birthday && (
              <div className="item-info">
                <p className='title-info-text'>День рождения</p>
                <p>{formatDate(profile.birthday)}</p>
              </div>
            )}
            {profile && profile.registdate && (
              <div className="item-info">
                <p className='title-info-text'>Участник с</p>
                <p>{formatDate(profile.registdate)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
