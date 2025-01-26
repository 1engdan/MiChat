import React from 'react';
import './leftPanel.css';
import SearchBar from "../searchBar/SearchBar";
import Panel from "../homePanel/Panel";
import SettingsList from "./list/SettingsList";

interface LeftPanelProps {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ selectedItem, setSelectedItem }) => {
  return (
    <div className='container-left-panel'>
      <SearchBar />
      <SettingsList selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <Panel />
    </div>
  );
};

export default LeftPanel;
