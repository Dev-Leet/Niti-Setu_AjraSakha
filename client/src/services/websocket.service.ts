import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
    this.socket = io(baseUrl, { auth: { token } });

    this.socket.on('connect', () => console.log('WebSocket connected'));
    this.socket.on('disconnect', () => console.log('WebSocket disconnected'));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: (data: unknown) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export const wsService = new WebSocketService();