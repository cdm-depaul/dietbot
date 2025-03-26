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
      className={`absolute w-full h-screen flex left-0 sm:justify-center sm:items-center backdrop-blur-[2px] z-10 ${
        open ? 'visible' : 'hidden'
      }`}
    >
      <div
        className={`absolute w-full sm:relative bottom-0 bg-stone-100 ${sizes['large']}`}
      >
        {children}
      </div>
    </div>
  );
});
