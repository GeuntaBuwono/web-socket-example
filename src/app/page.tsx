'use client';

import { useSocket } from '@/hooks/useSocket';
import dynamic from 'next/dynamic';

const ChatWindow = dynamic(() => import('@/components/ChatWindow'), { ssr: false, loading: () => <p>Loading...</p> });

export default function Home() {
  const leftChat = useSocket('left');
  const rightChat = useSocket('right');

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-500">Real-time Chat</h1>
        <div className="flex justify-between gap-8">
          <ChatWindow
            title="Left Chat"
            messages={leftChat.messages}
            onSendMessage={leftChat.sendMessage}
            isFlashing={leftChat.isFlashing}
            side="left"
          />
          <ChatWindow
            title="Right Chat"
            messages={rightChat.messages}
            onSendMessage={rightChat.sendMessage}
            isFlashing={rightChat.isFlashing}
            side="right"
          />
        </div>
      </div>
    </main>
  );
}
