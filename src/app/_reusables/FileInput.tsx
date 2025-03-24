'use client';
import React, { useEffect, useState } from 'react';
import { fileInputInterface } from './interface';

/**
 * Renders elements for uploading files.
 * @param accept This prop is to pass a string of acceptable files that are passed to the prop *accept* of **<input>** element.
 * @param children This component requires other html or components to be passed inside the body of the component.
 * @param className Pass css as a string in this parameter to style your component.
 * @param onChange Pass any callbacks to this prop that needs to be triggered on click of the button.
 * @returns JSX.
 */
export const FileInput: React.FC<fileInputInterface> = ({
  accept,
  children,
  className,
  onChange,
}) => {
  return (
    <div className={className}>
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => {
          if (!e.target.files) return;
          onChange(e.target.files);
        }}
        multiple={true}
      />
      <label htmlFor="file-input" className="cursor-pointer">
        {children}
      </label>
    </div>
  );
};
