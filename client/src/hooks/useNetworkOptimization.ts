import { useState, useEffect } from 'react';
import { networkDetection } from '@/utils/networkDetection';

export const useNetworkOptimization = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(() => networkDetection.isSlowConnection());
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'medium' | 'slow'>(() => networkDetection.getConnectionSpeed());

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    if (!connection) return;

    const updateConnection = () => {
      setIsSlowConnection(networkDetection.isSlowConnection());
      setConnectionSpeed(networkDetection.getConnectionSpeed());
    };

    connection.addEventListener('change', updateConnection);
    return () => connection.removeEventListener('change', updateConnection);
  }, []);

  return {
    isSlowConnection,
    connectionSpeed,
    shouldLoadImages: connectionSpeed !== 'slow',
    imageQuality: connectionSpeed === 'fast' ? 1 : connectionSpeed === 'medium' ? 0.7 : 0.5,
  };
};