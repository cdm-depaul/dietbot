'use client';
import React from 'react';
import { intentInterface } from './interface';

/**
 * This returns button representing intents that are present in the homepage
 * @param className Pass a string of css properties. Intented to work with tailwindCSS
 * @param text
 */
export const Intent: React.FC<intentInterface> = ({
  children,
  className,
  text,
}) => {
  return (
    <button
      onClick={() => console.log(text)}
      className={`hover:text-white hover:fill-white flex p-2 justify-center max-w-48 items-center border hover:grow-1 hover:transition-all duration-500 rounded-3xl ${className} cursor-pointer`}
    >
      {children}
      <div className="text-xs sm:text-md">{text}</div>
    </button>
  );
};
