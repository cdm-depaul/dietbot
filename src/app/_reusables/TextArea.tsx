'use client';
import React, { useState } from 'react';
import { textAreaInterace } from './interface';

/**
 * Renders textarea on the screen.
 * @param placeholder Placeholder to display on the textbox.
 * @param className Pass css as a string in this parameter to style your component.
 *
 * @returns JSX.
 */
export const TextArea: React.FC<textAreaInterace> = ({
  placeholder,
  className,
}) => {
  const [text, setText] = useState('');

  return (
    <textarea
      onChange={(e) => setText(e.target.value)}
      // onKeyDown={async (e) => {
      //   if (e.key === 'Enter') {
      //     const response = await fetch('http://localhost:4000/query', {
      //       method: 'POST',
      //       headers: {
      //         'content-type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         user_id: 2,
      //         query: text,
      //         context: {
      //           user_profile: {
      //             age: 29,
      //             sex: 'Male',
      //             height: 10,
      //             weight: 10,
      //             activity_level: 'Sedentary',
      //             allergies: ['fish'],
      //             likes: ['beef'],
      //             dislikes: ['onions'],
      //             diet: 'Vegetarian',
      //             goal: 'Lose Weight',
      //           },
      //           daily_nutrients: [],
      //         },
      //       }),
      //     });
      //     console.log(response);
      //   }
      // }}
      className={className}
      placeholder={placeholder}
      value={text}
    />
  );
};
