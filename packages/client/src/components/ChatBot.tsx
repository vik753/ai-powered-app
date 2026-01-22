import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import axios from 'axios';

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    reset();
    const { data } = await axios.post('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    console.log(data);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
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
  );
};

export default ChatBot;
