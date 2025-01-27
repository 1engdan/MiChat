import React from 'react';
import './detail.css';
import avatar from '../../assets/avatar.svg';

const Detail: React.FC = () => {
  return (
    <div className="detail-container">
      <div className="header-detail"></div>
      <div className="avatar-container">
        <img src={avatar} alt="Avatar"/>
      </div>
      <div className="user-details">
        <h2>namenamename</h2>
        <p>username</p>
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
      <div className="footer">
        <p>Полный профиль</p>
      </div>
    </div>
  );
};

export default Detail;
