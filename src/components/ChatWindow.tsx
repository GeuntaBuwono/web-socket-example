import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, SenderType } from '@/hooks/useSocket';
import { cx } from '@emotion/css';

type MessageItemProps = { message: Message, side: SenderType };
const MessageItem = ({ message, side }: MessageItemProps) => (
  <div
    className={cx('mb-4', message.sender === side ? 'text-right' : 'text-left')}
  >
    <div
      className={cx('inline-block p-3 rounded-lg',
        message.sender === side
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-800'

      )}
      suppressHydrationWarning
    >
      {message.text}
    </div>
    <div className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
      {new Date(message.timestamp).toLocaleTimeString()}
    </div>
  </div>
)

interface ChatWindowProps {
  title: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isFlashing: boolean;
  side: SenderType;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  title,
  messages,
  onSendMessage,
  isFlashing,
  side
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(
    () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    [],
  )


  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim()) {
        onSendMessage(input.trim());
        setInput('');
      }
    },
    [input, onSendMessage],
  )


  return (
    <div className={cx('flex flex-col h-[600px] w-full max-w-md border rounded-lg shadow-lg', isFlashing ? 'animate-flash' : '')}>
      <div className="p-4 bg-blue-600 text-white font-bold rounded-t-lg">
        {title}
      </div>
      <div className={cx('flex-1 p-4 overflow-y-auto bg-gray-50', isFlashing ? 'animate-flash' : '')}>
        {messages.map((message) => <MessageItem key={message.id} message={message} side={side} />)}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            required
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded text-gray-800"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow