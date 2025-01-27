import './App.css'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/login/Login"
import Chats from "./pages/chats/Chats"
import AuthType from './enum/Auth'
import Settings from './pages/settings/Settings';

const Router = () => {
  useEffect(() => {
    const handleContextMenu = (e: { preventDefault: () => void; }) => {
      e.preventDefault(); // Предотвращаем стандартное поведение
    };

    document.addEventListener('contextmenu', handleContextMenu);

    // Очистка обработчика при размонтировании компонента
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login action={AuthType.LOGIN} />} />
        <Route path="/register" element={<Login action={AuthType.REGISTER} />} />
        <Route path="/chats" element={<Chats/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>
    </Router>
  )
}

export default Router
