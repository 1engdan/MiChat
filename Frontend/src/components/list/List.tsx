import "./list.css";
import SearchBar from "./searchBar/SearchBar";
import ChatList from "./chatList/ChatList";

const List = () => {
  return (
    <div className="list">
      <SearchBar/>
      <ChatList/>
    </div>
  )
}

export default List