import React from 'react';
import { withSVGStylerHOC } from './SVGStylerHOC';
import { classNameProp } from './interface';
const SubmitSVG: React.FC<classNameProp> = ({ className }) => {
  return (
    <div className={className}>
      <svg viewBox="-1.5 0 19 19">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="m14.734 10.305-4.516 4.516a1.03 1.03 0 0 1-1.455-1.455l2.76-2.76h-9.53a1.03 1.03 0 1 1 0-2.058h9.53l-2.76-2.76a1.03 1.03 0 0 1 1.455-1.455l4.516 4.517a1.029 1.029 0 0 1 0 1.455z"></path>
        </g>
      </svg>
      {/* <svg viewBox="0 0 24 24">
        <g strokeLinecap="round" strokeLinejoin="round"></g>
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.596 13.058a1.495 1.495 0 0 0 0-2.116A39833.83 39833.83 0 0 0 15.963 5.3c-.39-.39-1.03-.39-1.42 0a.996.996 0 0 0 0 1.41l2.716 2.717a9.994 9.994 0 0 0 1.768 1.406l.342.214-.208.207a10 10 0 0 0-2.24-.254H3a1 1 0 1 0 0 2h13.922a10 10 0 0 0 2.24-.254l.207.207-.342.214c-.641.4-1.233.872-1.768 1.406l-2.716 2.717a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.42 0l5.633-5.642z"
          ></path>
        </g>
      </svg> */}
      {/* <svg
        viewBox="0 0 24 24"
        transform="rotate(45)matrix(1, 0, 0, 1, 0, 0)"
      >
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="m9.5 14.5-6.737-1.773c-.915-.241-1.015-1.5-.15-1.882l16.878-7.458c.71-.313 1.435.411 1.122 1.121l-7.458 16.879c-.383.865-1.641.765-1.882-.15L9.5 14.5z"></path>
        </g>
      </svg> */}
    </div>
  );
};

export default withSVGStylerHOC(SubmitSVG);
