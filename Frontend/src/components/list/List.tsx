import React from 'react';
import "./list.css";
import SearchBar from "../searchBar/SearchBar";
import ChatList from "./chatList/ChatList";
import Panel from "../homePanel/Panel";

interface ListProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const List: React.FC<ListProps> = () => {
  return (
    <div className="list">
      <SearchBar />
      <ChatList />
      <Panel />
    </div>
  );
};

export default List;
