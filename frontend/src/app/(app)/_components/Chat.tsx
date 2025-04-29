import React from 'react';
import { chatComponentInterface } from './interface';

export const Chat: React.FC<chatComponentInterface> = ({
  children,
  className,
}) => {
  return <div className={className}>{children}</div>;
};
