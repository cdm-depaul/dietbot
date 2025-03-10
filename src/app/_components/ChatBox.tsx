import React from 'react';
import { HorizontalRule, TextArea } from '../_reusables';

export const ChatBox = () => {
  return (
    <div className="sm:w-full w-[95%] flex flex-col shadow-md mb-5 sm:mb-0 mx-1 sm:mx-0 px-4 py-3 absolute sm:relative bottom-0 bg-white rounded-xl  max-h-[200px]">
      <TextArea
        placeholder="Akshay, what do you want to know?"
        className="w-full mb-4 field-sizing-content resize-none px-1 pt-1 focus:none outline-none min-h-8 overscroll-contain placeholder:text-md "
      />
      <HorizontalRule className="my-2" />
      <div className="flex justify-between items-center px-1">
        <span>pin</span>
        <div className="flex gap-4">
          <span>model</span>
          <span>click</span>
        </div>
      </div>
    </div>
  );
};
