import React, { useState, useEffect } from 'react';
import Button from '../../../buttons/Button';
import Modal from '../../modal/Modal';
import './account.css';
import { fetchProfile, updateUsername, updateEmail, updatePassword, deleteAccount, fetchUsername } from '../../../../request/api';

const Account: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const userId = accessToken ? JSON.parse(atob(accessToken.split('.')[1])).userId : null;
          const username = await fetchUsername(userId);
          const profile = await fetchProfile(username);
          setUserData({ username: profile.username, email: profile.email });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const openEditModal = (content: string) => {
    setModalContent(content);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setCurrentPassword('');
  };

  const getModalHeader = () => {
    switch (modalContent) {
      case 'username':
        return 'Изменение имени пользователя';
      case 'email':
        return 'Изменение электронной почты';
      case 'password':
        return 'Изменение пароля';
      default:
        return '';
    }
  };

  const getModalText = () => {
    switch (modalContent) {
      case 'username':
        return 'Имя пользователя';
      case 'email':
        return 'Электронная почта';
      case 'password':
        return 'Новый пароль';
      default:
        return '';
    }
  };

  const getModalBody = () => {
    switch (modalContent) {
      case 'username':
        return 'новое имя пользователя';
      case 'email':
        return 'новую электронную почту';
      case 'password':
        return 'новый пароль';
      default:
        return '';
    }
  };

  const handleUpdateUsername = async () => {
    try {
      await updateUsername({ new_username: newUsername, current_password: currentPassword });
      setUserData(prevData => ({ ...prevData, username: newUsername }));
      closeModal();
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail({ new_email: newEmail, current_password: currentPassword });
      setUserData(prevData => ({ ...prevData, email: newEmail }));
      closeModal();
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword({ new_password: newPassword, current_password: currentPassword });
      closeModal();
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({ current_password: currentPassword });
      // Перенаправьте пользователя на страницу входа или выполните другие действия
      closeModal();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className='account'>
      <div className='item-account'>
        <div className='texts-item'>
          <p className='title-account'>Имя пользователя</p>
          <p className='text-account'>{userData.username}</p>
        </div>
        <Button onClick={() => openEditModal("username")} children="Изменить" className='change'/>
      </div>
      <div className='item-account'>
        <div className='texts-item'>
          <p className='title-account'>Электронная почта</p>
          <p className='text-account'>{userData.email}</p>
        </div>
        <Button onClick={() => openEditModal("email")} children="Изменить" className='change'/>
      </div>
      <div className='item-account'>
        <div className='texts-item'>
          <p className='title-account'>Пароль</p>
        </div>
        <Button onClick={() => openEditModal("password")} children="Изменить" className='change'/>
      </div>

      <div className='item-account'>
        <div className='texts-item'>
          <p className='title-account'>Удаление учетной записи</p>
        </div>
        <Button onClick={openDeleteModal} children="Удалить" className='delete'/>
      </div>

      {/* Модальное окно для изменения данных */}
      <Modal isOpen={isEditModalOpen} onClose={closeModal}>
        <div className="modal-header">
          <h2>{getModalHeader()}</h2>
          <p>Введите {getModalBody()} и текущий пароль</p>
        </div>
        <div className='modal-body'>
          <div className='item-modal'>
            <p>{getModalText()}</p>
            <input
              type={modalContent === 'password' ? 'password' : 'text'}
              autoComplete='off'
              value={modalContent === 'username' ? newUsername : modalContent === 'email' ? newEmail : newPassword}
              onChange={(e) => {
                if (modalContent === 'username') setNewUsername(e.target.value);
                if (modalContent === 'email') setNewEmail(e.target.value);
                if (modalContent === 'password') setNewPassword(e.target.value);
              }}
            />
          </div>
          <div className='item-modal'>
            <p>Текущий пароль</p>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button onClick={closeModal} children="Отмена" className='negative modal-button' />
          <Button
            onClick={() => {
              if (modalContent === 'username') handleUpdateUsername();
              if (modalContent === 'email') handleUpdateEmail();
              if (modalContent === 'password') handleUpdatePassword();
            }}
            children="Готово"
            className='positive modal-button'
          />
        </div>
      </Modal>

      {/* Модальное окно для подтверждения удаления аккаунта */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeModal}>
        <div className="modal-header">
          <h2>Подтверждение удаления аккаунта</h2>
          <p>Вы уверены, что хотите удалить аккаунт?</p>
        </div>
        <div className="modal-body">
          <div className='item-modal'>
            <p>Введите текущий пароль для продолжения</p>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button onClick={closeModal} children="Отмена" className='negative modal-button' />
          <Button onClick={handleDeleteAccount} children="Да" className='positive modal-button' />
        </div>
      </Modal>
    </div>
  );
};

export default Account;
