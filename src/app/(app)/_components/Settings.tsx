'use client';
import React, { useCallback, useState } from 'react';
import { Button, Modal } from '_reusables';
import { SettingSVG } from '_svgs';
export const Settings: React.FC = () => {
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => setOpen(false), [open]);
  return (
    <>
      <Button
        className="w-9 h-9 p-1.5  relative rounded-full"
        onClick={() => setOpen(true)}
      >
        <SettingSVG className="before:content-['Settings'] before:-translate-x-7" />
      </Button>
      <Modal isOpen={open} size="medium" onClose={onClose}>
        <span onClick={() => setOpen(false)}>Settings</span>
      </Modal>
    </>
  );
};

Settings.displayName = '/components/Settings';
