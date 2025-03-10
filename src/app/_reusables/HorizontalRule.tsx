import React from 'react';
import { className } from './interface';

export const HorizontalRule: React.FC<className> = ({ className }) => {
  return <hr className={className} />;
};
