'use client';
import React from 'react';
import { withSVGStylerHOC } from './SVGStylerHOC';
import { classNameProp } from './interface';
const SubmitSVG: React.FC<classNameProp> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="-1.5 0 19 19">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="m14.734 10.305-4.516 4.516a1.03 1.03 0 0 1-1.455-1.455l2.76-2.76h-9.53a1.03 1.03 0 1 1 0-2.058h9.53l-2.76-2.76a1.03 1.03 0 0 1 1.455-1.455l4.516 4.517a1.029 1.029 0 0 1 0 1.455z"></path>
        </g>
      </svg>
    </div>
  );
};

export default withSVGStylerHOC(SubmitSVG);
