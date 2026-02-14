import React, { useState, useEffect } from 'react';
import styles from './ProgressiveImage.module.css';

interface Props {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
}

export const ProgressiveImage: React.FC<Props> = ({ src, placeholder, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${styles.image} ${isLoading ? styles.loading : ''} ${className || ''}`}
    />
  );
};