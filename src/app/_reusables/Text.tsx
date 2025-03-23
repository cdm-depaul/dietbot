import React from 'react';
import { textInterface } from './interface';

/**
 * To display text with custom classname and text
 * @param className Pass a string of css properties. Intented to work with tailwindCSS
 * @param text
 *
 */
export const Text: React.FC<textInterface> = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

Text.displayName = 'Text';
