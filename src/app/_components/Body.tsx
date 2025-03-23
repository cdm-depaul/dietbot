'use client';
import React from 'react';
import { childProps } from './interface';

/**
 * This is the body of the website where everything renders.
 * @example: <Body><div>Your content</div></Body>
 *
 */
export const Body: React.FC<childProps> = ({ children }) => {
  return (
    <div className=" flex justify-center h-screen min-h-screen text-[16px]">
      {/** Changing the width changes the extent to which the chat and its components takes space. */}
      <div className="sm:w-[55%] w-full">{children}</div>
    </div>
  );
};
