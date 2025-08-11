'use client';
import React, { useContext, useEffect, useRef } from 'react';
import type { chatComponentInterface } from './interface';
import chatContext from '../_context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ⬇️ Locally relax the prop type: children becomes optional
type ChatProps = Omit<chatComponentInterface, 'children'> & {
  children?: React.ReactNode;
};

export const Chat: React.FC<ChatProps> = ({ children, className }) => {
  const { chatHistory } = useContext(chatContext);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [chatHistory]);

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        className="w-full h-full overflow-auto p-4"
        aria-live="polite"
      >
        {chatHistory.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'bot'}`}>
            <div className="prose prose-sm max-w-none markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
            <span className="time">{m.role === 'user' ? 'You' : 'DietBot'}</span>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default Chat;
