'use client';
import React, { useEffect, useState } from 'react';
import { fileInputInterface } from './interface';

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
