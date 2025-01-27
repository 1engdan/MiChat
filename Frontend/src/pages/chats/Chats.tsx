import "./chats.css";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import Detail from "../../components/detail/Detail";
import { useState } from "react";

const Chats: React.FC = () => {
  const user = false;
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="container-chats">
      <List setSelectedChat={setSelectedChat} />
      <Chat selectedChat={selectedChat}/>
      {selectedChat && <Detail />}
    </div>
  );
};

export default Chats;
