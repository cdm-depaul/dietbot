'use client';
import React, { useState } from 'react';
import { Button, FileInput, HorizontalRule, TextArea } from '../_reusables';
import { AttachSVG, SubmitSVG } from '../_svgs';
import { ImageUploadsInChatBox } from './index';

/**
 *
 * Component that displays the chatbox on the screen.
 * Consists of TextArea, FileInput components within.
 */
export const ChatBox: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const readFromClipOrDropData = (items: DataTransferItemList | FileList) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image')) {
        let file;
        if (item instanceof DataTransferItem) {
          file = item.getAsFile();
        } else if (item instanceof File) {
          file = item;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImages((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file as Blob);
      }
    }
  };
  const onImageCancel = (imageIndex: number) => {
    let newImages = images.filter((el, index) => index != imageIndex);
    setImages([...newImages]);
  };
  return (
    <div
      className="sm:w-full w-[95%] flex flex-col shadow-md mb-5 sm:mb-0 mx-1 sm:mx-0 px-4 py-3 absolute sm:relative bottom-0 bg-white rounded-3xl max-h-[200px]"
      onPaste={(e) => readFromClipOrDropData(e.clipboardData.items)}
      onDrop={(e) => {
        e.preventDefault();
        readFromClipOrDropData(e.dataTransfer.files);
      }}
    >
      <ImageUploadsInChatBox
        images={images}
        callback={onImageCancel}
        cancelRequired={true}
      />
      <TextArea
        placeholder="What do you want to know?"
        className="w-full min-h-10 mb-4 field-sizing-content resize-none px-1 pt-1 focus:none outline-none overscroll-contain placeholder:text-stone-400"
      />
      <div className="flex justify-between items-center mt-2">
        <FileInput
          className="w-7 h-7 p-1 cursor-pointer border-stone-300 fill-stone-400 hover:rotate-45"
          accept="image/png image/jpg image/jpeg"
          onChange={(imageInput) => {
            let image_urls = [];
            for (let i = 0; i < imageInput.length; i++) {
              image_urls[i] = URL.createObjectURL(imageInput[i]);
            }
            setImages((prevImages) => [...prevImages, ...image_urls]);
          }}
        >
          <AttachSVG />
        </FileInput>
        <Button className="relative hover:left-1 cursor-pointer">
          <SubmitSVG className="fill-stone-400" />
        </Button>
      </div>
    </div>
  );
};

ChatBox.displayName = 'ChatBox';
