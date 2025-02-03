import React from 'react';
import './itemList.css';
import localAva from '../../../../assets/avatar.svg';

interface ItemListProps {
  id: string;
  avatar: string | null;
  name: string;
  selectedItem: string;
  handleChatSelect: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ id, avatar, name, selectedItem, handleChatSelect }) => {
  const isSelected = id === selectedItem;

  return (
    <div
      className={`item ${isSelected ? 'selected' : ''}`}
      onClick={() => handleChatSelect(id)}
    >
      <img src={avatar ? `https://api.michat.pw/${avatar}` : localAva} alt="img" />
      <div className="texts">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default ItemList;
