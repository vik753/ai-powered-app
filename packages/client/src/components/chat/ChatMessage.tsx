import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '@/components/chat/ChatBot.tsx';

interface ChatMessageProps {
  index: number;
  message: Message;
  messagesLength: number;
  lastMessageRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessage = ({
  index,
  message,
  messagesLength,
  lastMessageRef,
}: ChatMessageProps) => {
  const onCopyMessage = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      e.clipboardData.setData('text/plain', selectedText);
    }
  };

  return (
    <div
      className={`px-3 py-1 rounded-xl max-w-2/3
              ${
                message.role === 'user'
                  ? 'self-end bg-blue-600 text-white '
                  : 'self-start bg-gray-100 text-black'
              }`}
      onCopy={onCopyMessage}
      ref={index === messagesLength - 1 ? lastMessageRef : null}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto my-2">
              <table
                className="border-collapse border border-gray-400 w-full text-sm"
                {...props}
              />
            </div>
          ),
          th: ({ node: _node, ...props }) => (
            <th
              className="border border-gray-400 px-2 py-1 bg-gray-200 font-bold text-left"
              {...props}
            />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="border border-gray-400 px-2 py-1" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal ml-6 my-2" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc ml-6 my-2" {...props} />
          ),
          li: ({ node: _node, ...props }) => <li className="mb-1" {...props} />,
          p: ({ node: _node, ...props }) => (
            <p className="mb-2 last:mb-0" {...props} />
          ),
          h1: ({ node: _node, ...props }) => (
            <h1 className="text-xl font-bold my-2" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2 className="text-lg font-bold my-2" {...props} />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3 className="text-base font-bold my-1" {...props} />
          ),
          code: ({ node: _node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  fontSize: '10px',
                  borderRadius: '0.5rem',
                  margin: '0.5rem 0',
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-200 rounded px-1" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};
