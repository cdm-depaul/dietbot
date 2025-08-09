'use client';
import React, { useContext } from 'react';
import { Body, ChatBox } from '@/app/(app)/_components';
import chatContext from '../../_context/ChatContext';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Pull plain text out of whatever ReactNode we get
function nodeToText(node: any): string | null {
  if (node == null) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(nodeToText).filter(Boolean) as string[];
    return parts.length ? parts.join('') : null;
  }
  // React element: recurse into children
  if (React.isValidElement(node)) return nodeToText((node as any).props?.children);
  return null;
}

const ChatContainer: React.FC = () => {
  const { chatHistory } = useContext(chatContext);

  return (
    <Body className="flex flex-col items-center">
      <div className="flex-grow flex flex-col px-2 mt-16 w-full overflow-y-scroll">
        {chatHistory.map((msg: any, i: number) => {
          // Prefer explicit string or {content}; otherwise try to extract from JSX
          const content =
            typeof msg === 'string'
              ? msg
              : typeof msg?.content === 'string'
              ? msg.content
              : nodeToText(msg) ?? '';

          if (!content) {
            // Nothing extractable—render whatever it is
            return <div key={i}>{msg}</div>;
          }

          return (
            <div key={i} className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
      <ChatBox className="overflow-y-hidden sm:mb-5 flex-shrink-0" />
    </Body>
  );
};

export default ChatContainer;
