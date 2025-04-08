import React, { memo } from 'react';
import { inputInterface } from './interface';

export const Input: React.FC<inputInterface> = memo(
  ({ className, placeholder, type }) => {
    return (
      <input type={type} className={className} placeholder={placeholder} />
    );
  }
);

Input.displayName = '_reusables/Input';
