export interface HeaderProps {
  className?: string;
}

export interface UserMenuProps {
  user: {
    email: string;
    role: string;
  };
  onLogout: () => void;
} 