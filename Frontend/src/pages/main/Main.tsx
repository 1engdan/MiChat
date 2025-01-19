import "./main.css"
import List from "../../components/list/List"
import Chat from "../../components/chat/Chat"
import Detail from "../../components/detail/Detail"

const Main = () => {
  return (
    <div className="container">
      <List/>
      <Chat/>
      <Detail/>
    </div>
  )
}

export default Main