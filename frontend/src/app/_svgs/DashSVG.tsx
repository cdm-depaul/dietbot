import React from 'react';
import { withSVGStylerHOC } from './SVGStylerHOC';
import { className } from './interface';

const DashSVG: React.FC<className> = ({ className }) => {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M3 12L21 12"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    </span>
  );
};

DashSVG.displayName = '_svgs/DashSVG';

export default withSVGStylerHOC(DashSVG);
