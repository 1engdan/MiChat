import React from 'react';
import Header from '../../header/Header';
import './contentPanel.css';
import Profile from './profile/Profile';
import Account from './account/Account';
import Theme from './theme/Theme';

interface ContentPanelProps {
  selectedItem: string;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ selectedItem }) => {
  return (
    <div className="content-panel">
      <Header selectedItem={selectedItem} />
      <div className="content">
        {selectedItem === 'profile' && <Profile />}
        {selectedItem === 'account' && <Account />}
        {selectedItem === 'theme' && <Theme />}
        {selectedItem === 'logout' && <div>Logout Content</div>}
      </div>
    </div>
  );
};

export default ContentPanel;
