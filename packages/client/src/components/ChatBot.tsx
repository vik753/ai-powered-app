import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';

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
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

    reset();

    const { data } = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className={'flex flex-col p-4 gap-y-4 mb-4'}>
        {messages.map((message, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl max-w-2/3
              ${
                message.role === 'user'
                  ? 'self-end bg-blue-600 text-white '
                  : 'self-start bg-gray-100 text-black'
              }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </p>
        ))}
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
        />
        <Button className="rounded-full w-9 h-9" disabled={!formState.isValid}>
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
