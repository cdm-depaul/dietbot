'use client';
import React, { memo } from 'react';
import { modalInterface } from './interface';

export const Modal: React.FC<modalInterface> = memo(({ children, open }) => {
  const sizes = {
    small: 'sm:w-[50%] h-[60%] shadow-lg rounded-xl',
    medium: 'sm:w-[60%] h-[70%] shadow-xl rounded-2xl',
    large: 'sm:w-[70%] h-[80%] shadow-2xl rounded-3xl',
  };
  return (
    <div
      className={`fixed left-0 bottom-0 right-0 top-0 w-screen h-screen flex justify-center items-center backdrop-blur-[1px] z-10 pointer-events-auto ${
        open ? 'visible' : 'hidden'
      }`}
    >
      <div
        className={`absolute w-full sm:relative bottom-0 bg-white ${sizes['large']}`}
      >
        {children}
      </div>
    </div>
  );
});
