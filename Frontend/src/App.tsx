import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login/Login";
import Chats from "./pages/chats/Chats";
import AuthType from './enum/Auth';
import Settings from './pages/settings/Settings';
import { ReactElement } from 'react';

// Функция для проверки аутентификации пользователя
const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('access_token');
  return !!accessToken; // Возвращает true, если токен существует
};

// Компонент PrivateRoute для защиты маршрутов
const PrivateRoute = ({ element }: { element: ReactElement }): ReactElement => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// Компонент PublicRoute для защиты маршрутов логина и регистрации
const PublicRoute = ({ element }: { element: ReactElement }): ReactElement => {
  return !isAuthenticated() ? element : <Navigate to="/chats" />;
};

// Компонент NotFound для обработки несуществующих маршрутов
const NotFound = (): ReactElement => {
  return <Navigate to="/login" />;
};

// Компонент Logout для выхода из аккаунта
const Logout = (): ReactElement => {
  localStorage.removeItem('access_token');
  return <Navigate to="/login" />;
};

const App = (): ReactElement => {
  useEffect(() => {
    const handleContextMenu = (e: Event): void => {
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
        <Route path="/login" element={<PublicRoute element={<Login action={AuthType.LOGIN} />} />} />
        <Route path="/register" element={<PublicRoute element={<Login action={AuthType.REGISTER} />} />} />
        <Route path="/chats" element={<PrivateRoute element={<Chats />} />} />
        <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
