export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}