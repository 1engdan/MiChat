import "./chats.css";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import Detail from "../../components/detail/Detail";
import { useState } from "react";

const Chats: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  const openChat = (username: string) => {
    setSelectedChat(username);
    setShowDetail(false); // Close the detail view when opening a chat
  };

  return (
    <div className="container-chats">
      <List setSelectedChat={setSelectedChat} />
      <Chat selectedChat={selectedChat} toggleDetail={toggleDetail} showDetail={showDetail} />
      {showDetail && <Detail selectedChat={selectedChat} openChat={openChat} />} {/* Pass the openChat function */}
    </div>
  );
};

export default Chats;
