'use client';
import React, { memo } from 'react';
import { modalInterface } from './interface';
import { DashSVG } from '../_svgs';

/**
 * Renders a Modal on the screen.
 * @param children This component requires other html or components to be passed inside the body of the component.
 * @param isOpen  This prop handles whether the modal should be displayed or not.
 * @param size The size of the modal. Any one of [small, medium, large] should be passed and values here are case-sensitive
 *
 */
export const Modal: React.FC<modalInterface> = memo(
  ({ children, isOpen, size, onClose }) => {
    const sizes = {
      small: 'sm:w-[50%] sm:h-[60%] shadow-lg rounded-xl',
      medium: 'sm:w-[60%] sm:h-[70%] shadow-xl rounded-2xl',
      large: 'sm:w-[70%] sm:h-[80%] shadow-2xl rounded-3xl',
    };
    console.log('Modal');
    return (
      <div
        className={`fixed left-0 bottom-0 right-0 top-0 w-screen h-screen flex justify-center items-center backdrop-blur-[1px] z-10 pointer-events-auto ${
          isOpen
            ? 'transform sm:scale-100 scale-y-100 origin-bottom'
            : 'transform sm:scale-0 scale-y-0 origin-bottom'
        } transition-all sm:duration-0 duration-550`}
        onClick={onClose}
      >
        <div
          className={`absolute w-full h-[90%] overflow-auto sm:relative bottom-0 bg-white ${sizes[size]}`}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="w-full visible sm:hidden h-8 sticky top-0 flex items-center justify-center bg-stone-200"
            onTouchMove={onClose}
          >
            <DashSVG className="w-16 h-4 transorm scale-x-100 flex items-center hover-none" />
          </span>
          {children}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
);
