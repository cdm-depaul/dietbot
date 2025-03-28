'use client';
import React from 'react';
import { className } from './interface';
import { withSVGStylerHOC } from './SVGStylerHOC';

const ChatHistorySVG: React.FC<className> = ({ className }) => {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" fill="none">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M12 8V12L15 15" strokeWidth="2" strokeLinecap="round"></path>
          <circle cx="12" cy="12" r="9" strokeWidth="2"></circle>
        </g>
      </svg>
    </span>
  );
};

export default withSVGStylerHOC(ChatHistorySVG);
