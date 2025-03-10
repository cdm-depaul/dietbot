import React from 'react';
import { childProps, className } from './interface';

export const Intent: React.FC<childProps & className> = ({
  children,
  className,
}) => {
  return (
    <button
      className={`flex p-2 justify-center max-w-48 items-center border hover:grow-1 hover:transition-all duration-500 rounded-lg ${className}`}
    >
      {children}
    </button>
  );
};
