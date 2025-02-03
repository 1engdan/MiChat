import React, { useState } from 'react';
import './leftPanel.css';
import SearchBar from "../searchBar/SearchBar";
import Panel from "../homePanel/Panel";
import SettingsList from "./list/SettingsList";

interface LeftPanelProps {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ selectedItem, setSelectedItem }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className='container-left-panel'>
      <SearchBar onSearch={handleSearch} />
      <SettingsList selectedItem={selectedItem} setSelectedItem={setSelectedItem} searchValue={searchValue} />
      <Panel />
    </div>
  );
};

export default LeftPanel;
