'use client';
import React, { useCallback, useState } from 'react';
import { Button, Modal } from '_reusables';
import { ChatHistorySVG, SearchSVG } from '_svgs';
import { Input } from '../../_reusables/Input';
export const ChatHistory: React.FC = () => {
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), [open]);
  return (
    <>
      <Button
        className="w-9 h-9 p-1.5  relative rounded-full"
        onClick={() => setOpen(true)}
      >
        <ChatHistorySVG className="before:content-['Chat_History']" />
      </Button>
      <Modal isOpen={open} size="large" onClose={onClose}>
        <div className="w-full h-full p-2 px-4">
          <span className="flex items-center pt-4 justify-between border-b-2">
            <Input
              type="text"
              className="w-full p-1 focus:outline-0 "
              placeholder="Search history"
            />
            <SearchSVG className="w-8 h-8" />
          </span>
        </div>
      </Modal>
    </>
  );
};

ChatHistory.displayName = '/components/ChatHistory';
