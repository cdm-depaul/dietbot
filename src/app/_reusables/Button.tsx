import React from 'react';
import { buttonProps } from './interface';
export const Button: React.FC<buttonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};
