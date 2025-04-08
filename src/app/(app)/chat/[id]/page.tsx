'use client';
import React, { useContext } from 'react';
import { Body, ChatBox } from '@/app/(app)/_components';
import chatContext from '../../_context/ChatContext';
const ChatContainer: React.FC = () => {
  const { chatHistory } = useContext(chatContext);
  return (
    <Body className="flex flex-col items-center">
      <div className="flex-grow flex flex-col px-2 mt-16 w-full overflow-y-scroll">
        {chatHistory.map((el, i) => (
          <div key={i}>{el}</div>
        ))}
      </div>
      <ChatBox className="overflow-y-hidden sm:mb-5 flex-shrink-0" />
    </Body>
  );
};

export default ChatContainer;
