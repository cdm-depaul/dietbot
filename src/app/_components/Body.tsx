'use client';
import React from 'react';
import { bodyInterface } from './interface';

/**
 * This is the body of the website where everything renders.
 * @example: <Body><div>Your content</div></Body>
 *
 */
export const Body: React.FC<bodyInterface> = ({ children, className }) => {
  return (
    <div className=" flex justify-center h-screen min-h-screen">
      {/** Changing the width changes the extent to which the chat and its components takes space. */}
      <div className={`sm:w-[55%] w-full ${className}`}>{children}</div>
    </div>
  );
};
