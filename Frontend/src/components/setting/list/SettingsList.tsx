import React from 'react';
import "./settingList.css";

interface SettingsListProps {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsList: React.FC<SettingsListProps> = ({ selectedItem, setSelectedItem }) => {
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
            onClick={() => setSelectedItem('logout')}
          >
            <span>Выйти</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsList;
