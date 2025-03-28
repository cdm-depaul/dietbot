'use client';
import React, { memo } from 'react';
import { modalInterface } from './interface';

export const Modal: React.FC<modalInterface> = memo(
  ({ children, isOpen, size }) => {
    const sizes = {
      small: 'sm:w-[50%] sm:h-[60%] shadow-lg rounded-xl',
      medium: 'sm:w-[60%] sm:h-[70%] shadow-xl rounded-2xl',
      large: 'sm:w-[70%] sm:h-[80%] shadow-2xl rounded-3xl',
    };
    return (
      <div
        className={`fixed left-0 bottom-0 right-0 top-0 w-screen h-screen flex justify-center items-center backdrop-blur-[1px] z-10 pointer-events-auto ${
          isOpen
            ? 'transform sm:scale-100 scale-y-100'
            : 'transform sm:scale-0 scale-y-0'
        } transition-all sm:duration-100 duration-500`}
      >
        <div
          className={`absolute w-full h-[90%] sm:relative bottom-0 bg-white ${sizes[size]}`}
        >
          {children}
        </div>
      </div>
    );
  }
);
