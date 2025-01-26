import React, { useState } from 'react';
import Button from '../../../buttons/Button';
import Modal from '../../modal/Modal';
import './account.css';

const Account: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

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

  return (
    <div className='account'>
      <div className='item-account'>
        <div className='item'>
          <p className='title-account'>Имя пользователя</p>
          <p className='text-account'>username</p>
        </div>
        <Button onClick={() => openEditModal("username")} children="Изменить" className='change'/>
      </div>
      <div className='item-account'>
        <div className='item'>
          <p className='title-account'>Электронная почта</p>
          <p className='text-account'>email</p>
        </div>
        <Button onClick={() => openEditModal("email")} children="Изменить" className='change'/>
      </div>
      <div className='item-account'>
        <div className='item'>
          <p className='title-account'>Пароль</p>
        </div>
        <Button onClick={() => openEditModal("password")} children="Изменить" className='change'/>
      </div>

      <div className='item-account'>
        <div className='item'>
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
            <input type={modalContent === 'password' ? 'password' : 'text'} />
          </div>
          <div className='item-modal'>
            <p>Текущий пароль</p>
            <input type='password' />
          </div>
        </div>
        <div className="modal-footer">
          <Button onClick={closeModal} children="Отмена" className='negative modal-button' />
          <Button onClick={closeModal} children="Готово" className='positive modal-button' />
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
            <input type='password' />
          </div>
        </div>
        <div className="modal-footer">
          <Button onClick={closeModal} children="Отмена" className='negative modal-button' />
          <Button onClick={closeModal} children="Да" className='positive modal-button' />
        </div>
      </Modal>
    </div>
  );
};

export default Account;
