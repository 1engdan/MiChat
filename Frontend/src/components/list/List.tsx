import React, { useState } from 'react';
import "./list.css";
import SearchBar from "../searchBar/SearchBar";
import ChatList from "./chatList/ChatList";
import Panel from "../homePanel/Panel";

interface ListProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const List: React.FC<ListProps> = ({ setSelectedChat }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="list">
      <SearchBar onSearch={handleSearch} />
      <ChatList setSelectedChat={setSelectedChat} searchValue={searchValue} />
      <Panel />
    </div>
  );
};

export default List;
