import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { TypingIndicator } from '@/components/chat/TypingIndicator.tsx';
import { ChatMessage } from '@/components/chat/ChatMessage.tsx';
import {
  type ChatFormData,
  InputComponent,
} from '@/components/chat/InputComponent.tsx';

type ChatResponse = {
  message: string;
};

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string>('');

  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmitHandler = async ({ prompt }: ChatFormData) => {
    try {
      setError('');
      setIsBotTyping(true);
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err?.message : 'Unknown error';
      setError(`Something went wrong. Please try again later. ${errorMessage}`);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className={'flex flex-col h-full'}>
      <div className={'flex flex-col p-4 gap-y-4 mb-4 flex-1 overflow-y-auto'}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            lastMessageRef={
              index === messages.length - 1 ? lastMessageRef : null
            }
          />
        ))}
        {isBotTyping && <TypingIndicator />}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <InputComponent onSubmit={onSubmitHandler} />
    </div>
  );
};

export default ChatBot;
