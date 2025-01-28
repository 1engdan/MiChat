import './profile.css'
import avatar from '../../assets/avatar.svg';
import React from 'react';
import Button from '../buttons/Button';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="profile-container" onClick={handleOverlayClick}>
      <div className="profile-content" onClick={e => e.stopPropagation()}>
        <div className="header-detail"></div>
        <div className="avatar-container">
          <img src={avatar} alt="Avatar"/>
        </div>
        <div className="user-details">
          <div className="user-detail">
            <h2>namenamename</h2>
            <p>username</p>
          </div>
          <Button onClick={() => {}} className="button-send" children="Сообщение"></Button>
        </div>
        <div className="user-info">
          <div className="item-info">
            <p className='title-info-text'>Обо мне</p>
            <p>blah blah blah</p>
          </div>
          <div className="item-info">
            <p className='title-info-text'>День рождения</p>
            <p>24 ноября 2024 г.</p>
          </div>
          <div className="item-info">
            <p className='title-info-text'>Участник с</p>
            <p>24 ноября 2024 г.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile