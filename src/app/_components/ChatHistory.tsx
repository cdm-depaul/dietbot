'use client';
import React, { useState } from 'react';
import { Button, Modal } from '../_reusables';
import { ChatHistorySVG } from '../_svgs';
export const ChatHistory: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        className="w-9 h-9 p-1.5  relative rounded-full"
        onClick={() => setOpen(true)}
      >
        <ChatHistorySVG className="before:content-['Chat_History']" />
      </Button>
      <Modal isOpen={open} size="large">
        <span onClick={() => setOpen(false)}>Settings</span>
      </Modal>
    </>
  );
};

ChatHistory.displayName = '/components/ChatHistory';
