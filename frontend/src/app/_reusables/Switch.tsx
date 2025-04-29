'use client';
import React, { useState } from 'react';

/**
 * Renders a switch on the screen.
 * @returns JSX
 */
export const Switch: React.FC = () => {
  const [isChecked, setChecked] = useState<boolean>(false);
  return (
    <>
      <label
        htmlFor="switch"
        className="w-12 h-6  border rounded-full relative flex items-center border-stone-300"
      >
        <span
          className={`w-4 h-4 border mx-0.5 transition-transform duration-150 rounded-full border-stone-400 ${
            isChecked ? 'translate-x-6 w-4.5 h-4.5' : 'translate-x-0'
          }`}
        />
      </label>
      <input
        className="hidden"
        type="checkbox"
        id="switch"
        value={`${isChecked}`}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </>
  );
};

Switch.displayName = 'Switch';
