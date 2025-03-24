import React from 'react';
import { className } from './interface';

/**
 * Renders a horizontal ruler on screen.
 * @param className Pass css as a string in this parameter to style your component.
 *
 * @returns JSX.
 */
export const HorizontalRule: React.FC<className> = ({ className }) => {
  return <hr className={className} />;
};
