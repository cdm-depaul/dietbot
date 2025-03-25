'use client';
import React from 'react';
import { Body, ChatBox } from '@/app/_components';
const page = () => {
  return (
    <Body className="flex flex-col items-center">
      <div className="flex-grow ">Content</div>
      <ChatBox className="overflow-y-hidden sm:mb-5" />
    </Body>
  );
};

export default page;
