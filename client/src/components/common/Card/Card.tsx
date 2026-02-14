import React from 'react';
import styles from './Card.module.css';
import { cn } from '@utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hoverable }) => {
  return (
    <div
      className={cn( 
        styles.card,
        hoverable && styles.hoverable,
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};