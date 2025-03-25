'use client';
import React from 'react';
import { conversationalTyping } from './interface';
import './reusable.css';

/**
 * Renders conversational style of displaying text.
 * @param animationDelay
 * @param animationDuration
 * @param animationSteps
 * @param className
 * @param text Pass a string of css properties. Intented to work with tailwindCSS
 */
export const Conversation: React.FC<conversationalTyping> = ({
  animationDelay,
  animationDuration,
  animationSteps,
  className,
  text,
}) => {
  return (
    <div
      style={{
        ...({
          '---animation-delay': `${animationDelay}s`,
          '--animation-duration': `${animationDuration}s`,
          '--animation-timing-function': `steps(${animationSteps}, end)`,
        } as React.CSSProperties),
      }}
      className={`${className} conversation`}
    >
      {text}
    </div>
  );
};
