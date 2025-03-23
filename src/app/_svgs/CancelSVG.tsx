'use client';
import React from 'react';
import { className } from '../_components/interface';
import { withSVGStylerHOC } from './SVGStylerHOC';

const CancelSVG: React.FC<className> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="-3.5 0 19 19">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path>
        </g>
      </svg>
    </div>
  );
};

export default withSVGStylerHOC(CancelSVG);
