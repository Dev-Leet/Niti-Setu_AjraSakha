import { useEffect } from 'react';
import { wsService } from '@services/websocket.service';
import { useAppSelector } from '@store/hooks';

export const useWebSocket = () => {
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('accessToken');
      if (token) wsService.connect(token);
    }
    return () => wsService.disconnect();
  }, [user]);

  return wsService;
}; 