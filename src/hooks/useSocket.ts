import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type SenderType = 'left' | 'right';

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: number;
}

export const useSocket = (sender: SenderType) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat-messages');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message: Message) => {
      setMessages(prev => {
        const newMessages = [...prev, message];
        localStorage.setItem('chat-messages', JSON.stringify(newMessages));
        return newMessages;
      });
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1000);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = useCallback((text: string) => {
    if (!socket) return;

    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now(),
    };

    socket.emit('message', message);
    setMessages(prev => {
      const newMessages = [...prev, message];
      localStorage.setItem('chat-messages', JSON.stringify(newMessages));
      return newMessages;
    });
  }, [socket, sender]);

  return { messages, sendMessage, isFlashing };
};
