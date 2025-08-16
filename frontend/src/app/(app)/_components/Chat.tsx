'use client';
import React, { useContext, useEffect, useRef } from 'react';
import { chatComponentInterface } from './interface';
import chatContext from '../_context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Chat: React.FC<chatComponentInterface> = ({ children, className }) => {
  const { chatHistory } = useContext(chatContext);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Keep the most-recent USER prompt near the top so the reply starts in view
 useEffect(() => {
  const scroller = scrollerRef.current;
  if (!scroller) return;

  const userMsgs = scroller.querySelectorAll<HTMLElement>('.msg.user');
  const lastUser = userMsgs[userMsgs.length - 1];

  if (lastUser) {
    lastUser.scrollIntoView({
      behavior: 'smooth',
      block: 'start', // keep it to the top
    });
  }
}, [chatHistory]);

  const items = [...chatHistory]; // chronological order

  return (
    <div className={className}>
      <div ref={scrollerRef} className="w-full h-full overflow-auto p-4 space-y-3">
        {items.map((m, i) => {
          const isUser = m.role === 'user';
          const isPending = m.pending;
          const took =
            typeof m.durationMs === 'number'
              ? ` ⏱ ${(m.durationMs / 1000).toFixed(1)}s`
              : '';

          return (
            <div key={i} className={`msg ${isUser ? 'user' : 'bot'}`}>
              {/* Bubble content */}
              <div className="prose prose-sm max-w-none markdown">
                 {/* Meta line */}
              <span className="time">
                {isUser ? 'You' : 'DietBot'}
                {!isUser && !isPending && took}
              </span>
                {isPending ? (
                  <div className="typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>

             
            </div>
          );
        })}
      </div>

      {children}

      {/* typing indicator */}
      <style jsx>{`
        .typing {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          height: 1.25em;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.4;
          animation: pulse 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes pulse {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chat;