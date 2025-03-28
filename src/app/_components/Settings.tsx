'use client';
import React, { useState } from 'react';
import { Button, Modal } from '../_reusables';
import { SettingSVG } from '../_svgs';
export const Settings: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        className="w-9 h-9 p-1.5  relative rounded-full"
        onClick={() => setOpen(true)}
      >
        <SettingSVG className="before:content-['Settings'] before:-translate-x-7" />
      </Button>
      <Modal isOpen={open} size="medium">
        <span
          className="w-full flex justify-center bg-red-300 h-5"
          onTouchMove={() => setOpen(false)}
        >
          -
        </span>
        <span onClick={() => setOpen(false)}>Settings</span>
      </Modal>
    </>
  );
};

Settings.displayName = '/components/Settings';
