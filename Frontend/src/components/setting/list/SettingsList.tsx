import React, { useState } from 'react';
import "./settingList.css";
import Modal from '../modal/Modal';
import Button from '../../buttons/Button';

interface SettingsListProps {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsList: React.FC<SettingsListProps> = ({ selectedItem, setSelectedItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('access_token');
    setIsModalOpen(false);
    window.location.href = '/login';
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="settin-list">
      <div className="title-settin">
        <p>Настройки</p>
      </div>
      <div className="list-items">
        <div className='list-setting'>
          <div
            className={`item ${selectedItem === 'profile' ? 'selected' : ''}`}
            onClick={() => setSelectedItem('profile')}
          >
            <span>Профиль</span>
          </div>
          <div
            className={`item ${selectedItem === 'account' ? 'selected' : ''}`}
            onClick={() => setSelectedItem('account')}
          >
            <span>Аккаунт</span>
          </div>
          <div
            className={`item ${selectedItem === 'theme' ? 'selected' : ''}`}
            onClick={() => setSelectedItem('theme')}
          >
            <span>Внешний вид</span>
          </div>
        </div>
        <div className="list-logout">
          <div
            className={`item ${selectedItem === 'logout' ? 'selected' : ''}`}
            onClick={handleLogout}
          >
            <span>Выйти</span>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="modal-header">
          <p>Выход</p>
        </div>
        <div className="modal-body">
          <div className='item-modal'>
            <p>Вы точно хотите выйти?</p>
          </div>
        </div>
        <div className="modal-footer">
          <Button onClick={closeModal} children="Отмена" className='negative modal-button' />
          <Button onClick={confirmLogout} children="Да" className='positive modal-button' />
        </div>
      </Modal>
    </div>
  );
};

export default SettingsList;
