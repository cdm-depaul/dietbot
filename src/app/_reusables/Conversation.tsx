import React from 'react';
import { conversationalTyping } from './interface';
import './reusable.css';

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
