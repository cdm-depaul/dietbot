import React from 'react';
import { childProps } from './interface';

export const Body: React.FC<childProps> = ({ children }) => {
  return (
    <div className="app-body flex justify-center bg-[rgba(235, 235, 235, 0.3)]">
      <div className="sm:w-[50%] w-full">{children}</div>
    </div>
  );
};
