
import React from 'react';
import { Button } from "@/components/ui/button";

interface TabMenuProps {
  activeTab: 'post' | 'find';
  onTabChange: (tab: 'post' | 'find') => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b mb-4">
      <Button
        variant={activeTab === 'post' ? 'default' : 'ghost'}
        className={`py-2 px-4 rounded-t-md ${activeTab === 'post' ? 'bg-fastlabor-600 text-white' : 'hover:text-fastlabor-600'}`}
        onClick={() => onTabChange('post')}
      >
        🚀 Post Job
      </Button>
      <Button
        variant={activeTab === 'find' ? 'default' : 'ghost'}
        className={`py-2 px-4 rounded-t-md ${activeTab === 'find' ? 'bg-fastlabor-600 text-white' : 'hover:text-fastlabor-600'}`}
        onClick={() => onTabChange('find')}
      >
        🔍 Find Job
      </Button>
    </div>
  );
};

export default TabMenu;
