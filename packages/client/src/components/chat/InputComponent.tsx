import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button.tsx';

export type ChatFormData = {
  prompt: string;
};

interface Props {
  onSubmit: (data: ChatFormData) => void;
}

export const InputComponent = ({ onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmit(data);
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="flex flex-col gap-2 items-end rounded-xl border-2 p-4"
      onSubmit={submit}
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
  );
};
