import { useEffect, useState } from 'react';
import './theme.css';

const Theme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Инициализируем состояние на основе текущего класса body
    return document.body.classList.contains('dark') ? 'dark' : 'light';
  });

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.body.className = theme; // Обновляем класс body для применения темы
  };

  useEffect(() => {
    // Синхронизируем состояние с текущим классом body при монтировании компонента
    const initialTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setCurrentTheme(initialTheme);
  }, []);

  return (
    <div className="container-theme">
      <p>Тема</p>
      <div className="theme-list">
        <div
          className={`theme-item light ${currentTheme === 'light' ? 'selected' : ''}`}
          onClick={() => handleThemeChange('light')}></div>
        <div
          className={`theme-item dark ${currentTheme === 'dark' ? 'selected' : ''}`}
          onClick={() => handleThemeChange('dark')}></div>
      </div>
    </div>
  );
};

export default Theme;
