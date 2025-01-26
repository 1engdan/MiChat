import React from 'react';
import "./list.css";
import SearchBar from "../searchBar/SearchBar";
import ChatList from "./chatList/ChatList";
import Panel from "../homePanel/Panel";

interface ListProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const List: React.FC<ListProps> = ({ setSelectedChat }) => {
  return (
    <div className="list">
      <SearchBar />
      <ChatList setSelectedChat={setSelectedChat} />
      <Panel />
    </div>
  );
};

export default List;
