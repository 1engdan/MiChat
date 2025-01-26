import React from 'react';
import './header.css';

interface HeaderProps {
  selectedItem: string;
}

const Header: React.FC<HeaderProps> = ({ selectedItem }) => {
  let title = '';

  switch (selectedItem) {
    case 'profile':
      title = 'Профиль';
      break;
    case 'account':
      title = 'Аккаунт';
      break;
    case 'theme':
      title = 'Внешний вид';
      break;
    case 'logout':
      title = 'Выйти';
      break;
    default:
      title = 'Профиль';
  }

  return (
    <div className="header">
      <p>{title}</p>
    </div>
  );
};

export default Header;
