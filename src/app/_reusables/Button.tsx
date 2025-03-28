'use client';
import React, { memo } from 'react';
import { buttonProps } from './interface';
/**
 * Renders a button.
 * @param children This component requires other html or components to be passed inside the body of the component.
 * @param className Pass css as a string in this parameter to style your component.
 * @param onClick Pass any callbacks to this prop that needs to be triggered on click of the button.
 * @returns JSX.
 */
export const Button: React.FC<buttonProps> = memo(
  ({ children, className, disabled, onClick }) => {
    return (
      <button
        disabled={disabled}
        className={`${className} disabled:cursor-not-allowed cursor-pointer`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
);
