import React from 'react';
import { textInterface } from './interface';

export const Text: React.FC<textInterface> = ({ text }) => {
  return <div className="text-xs sm:text-md font-semibold">{text}</div>;
};
