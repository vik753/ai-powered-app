import axios from 'axios';
import { Button } from '../ui/button.tsx';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { TypingIndicator } from '@/components/chat/TypingIndicator.tsx';
import { ChatMessage } from '@/components/chat/ChatMessage.tsx';

type FormData = {
  prompt: string;
};

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

  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setError('');
      setIsBotTyping(true);
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

      reset();

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

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
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
      <form
        className="flex flex-col gap-2 items-end rounded-xl border-2 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (value) => value.trim().length > 0,
          })}
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
          onKeyDown={onKeyDown}
          autoFocus={true}
        />
        <Button className="rounded-full w-9 h-9" disabled={!formState.isValid}>
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
