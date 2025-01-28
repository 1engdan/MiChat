import { useState } from 'react';
import ContentPanel from '../../components/setting/contentPanel/ContentPanel';
import LeftPanel from '../../components/setting/LeftPanel';
import './settings.css';

const Settings = () => {
  const [selectedItem, setSelectedItem] = useState('profile'); // Инициализируем состояние с начальным значением

  return (
    <div className='container-settin'>
      <LeftPanel selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <ContentPanel selectedItem={selectedItem} />
    </div>
  );
};

export default Settings;
