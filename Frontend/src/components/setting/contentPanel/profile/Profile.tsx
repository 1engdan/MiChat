import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../buttons/Button';
import './profile.css';
import { fetchProfile, updateProfile, fetchUsername, uploadImage, deleteImage } from '../../../../request/api';

const Profile: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [about_me, setAboutMe] = useState<string>('');
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState = { name, about_me };
  const [savedState, setSavedState] = useState(initialState);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const userId = accessToken ? JSON.parse(atob(accessToken.split('.')[1])).userId : null;
          const username = await fetchUsername(userId);
          setUsername(username);
          const profile = await fetchProfile(username);
          if (username == profile.name) {
            setName('');
          } else {
            setName(profile.name);
          }
          setAboutMe(profile.about_me || '');
          setSavedState({ name: profile.name || '', about_me: profile.about_me || ''});
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (name !== savedState.name || about_me !== savedState.about_me) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [name, about_me, savedState]);

  const handleSave = async () => {
    try {
      await updateProfile({ name, about_me });
      setSavedState({ name, about_me });
      setIsChanged(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setName(savedState.name);
    setAboutMe(savedState.about_me);
    setIsChanged(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadImage(file);
        alert('Изображение успешно загружено');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      await deleteImage();
      alert('Изображение успешно удалено');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className='profile'>
      <div className='item-profile'>
        <p>Отображаемое имя</p>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={username}
        />
      </div>
      <div className='item-profile'>
        <p>Обо мне</p>
        <input
          type='text'
          value={about_me}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </div>
      <div className='item-profile'>
        <p>Изображение профиля</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <div className="buttons">
          <Button onClick={handleChangeImageClick} children="Смена изображение" className='positive'/>
          <Button onClick={handleImageDelete} children="Удалить изображение" className='negative'/>
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
