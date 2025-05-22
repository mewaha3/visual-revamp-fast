
import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface TabMenuProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (tabId: string) => void;
}
