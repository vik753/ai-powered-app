import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    setIsBotTyping(true);
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

    reset();

    const { data } = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    setIsBotTyping(false);
    setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopyMessage = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selectedText);
    }
  };

  return (
    <div className={'flex flex-col h-full'}>
      <div className={'flex flex-col p-4 gap-y-4 mb-4 flex-1 overflow-y-auto'}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`px-3 py-1 rounded-xl max-w-2/3
              ${
                message.role === 'user'
                  ? 'self-end bg-blue-600 text-white '
                  : 'self-start bg-gray-100 text-black'
              }`}
            onCopy={onCopyMessage}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div className={'flex gap-1 px-3 py-1'}>
            <div className=" w-3 h-3 bg-neutral-800 rounded-xl animate-pulse"></div>
            <div className="w-3 h-3 bg-neutral-800 rounded-xl animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-neutral-800 rounded-xl animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}
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
