import React, { useState } from 'react';
import "./settingList.css";
import Modal from '../modal/Modal';
import Button from '../../buttons/Button';

interface SettingsListProps {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
}

const SettingsList: React.FC<SettingsListProps> = ({ selectedItem, setSelectedItem, searchValue }) => {
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

  const settingsItems = [
    { id: 'profile', name: 'Профиль' },
    { id: 'account', name: 'Аккаунт' },
    { id: 'theme', name: 'Внешний вид' },
    { id: 'logout', name: 'Выйти' }
  ];

  const filteredItems = settingsItems.filter(item =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="settin-list">
      <div className="title-settin">
        <p>Настройки</p>
      </div>
      <div className="list-items">
        <div className='list-setting'>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className={`item ${selectedItem === item.id ? 'selected' : ''}`}
              onClick={() => item.id === 'logout' ? handleLogout() : setSelectedItem(item.id)}
            >
              <span>{item.name}</span>
            </div>
          ))}
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
