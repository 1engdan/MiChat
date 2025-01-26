import React, { useState, useEffect } from 'react';
import Button from '../../../buttons/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './profile.css';

const Profile: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [aboutMe, setAboutMe] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const initialState = { displayName, aboutMe, selectedDate };
  const [savedState, setSavedState] = useState(initialState);

  useEffect(() => {
    if (displayName !== savedState.displayName || aboutMe !== savedState.aboutMe || selectedDate !== savedState.selectedDate) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [displayName, aboutMe, selectedDate, savedState]);

  const handleSave = () => {
    setSavedState({ displayName, aboutMe, selectedDate });
    setIsChanged(false);
  };

  const handleCancel = () => {
    setDisplayName(savedState.displayName);
    setAboutMe(savedState.aboutMe);
    setSelectedDate(savedState.selectedDate);
    setIsChanged(false);
  };

  return (
    <div className='profile'>
      <div className='item-profile'>
        <p>Отображаемое имя</p>
        <input
          type='text'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className='item-profile'>
        <p>Обо мне</p>
        <input
          type='text'
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </div>
      <div className='item-profile'>
        <p>Дата рождения</p>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Выберите дату"
        />
      </div>
      <div className='item-profile'>
        <p>Изображение профиля</p>
        <div className="buttons">
          <Button onClick={() => {}} children="Смена изображение" className='positive'/>
          <Button onClick={() => {}} children="Удалить изображение" className='negative'/>
        </div>
      </div>
      {isChanged && (
        <div className="save-bar">
          <Button onClick={handleCancel} children="Отмена" className='negative'/>
          <Button onClick={handleSave} children="Сохранить" className='positive'/>
        </div>
      )}
    </div>
  );
};

export default Profile;
