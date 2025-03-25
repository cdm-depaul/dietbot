'use client';
import React, { useState } from 'react';
import { Button, FileInput, Switch, TextArea } from '../_reusables';
import { AttachSVG, SubmitSVG } from '../_svgs';
import { ImageUploadsInChatBox } from './index';
import { readFromClipOrDropData } from './utils';
/**
 *
 * Component that displays the chatbox on the screen.
 * Consists of ImageUploadsInChatBox,TextArea, FileInput components within.
 */
export const ChatBox: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  /**
   * This method is used here as it is passed as a callback to FileInput and creates a url for the image once the image is read and fed back.
   * @param imageInput FileList, that is returned by FileInput Component.
   */
  const readImage = (imageInput: FileList) => {
    let image_urls = [];
    for (let i = 0; i < imageInput.length; i++) {
      image_urls[i] = URL.createObjectURL(imageInput[i]);
    }
    setImages((prevImages) => [...prevImages, ...image_urls]);
  };
  /**
   * Method used to read images onDrop or onPaste.
   * @param items
   */
  const readImages = (items: DataTransferItemList | FileList): void => {
    const newImages = readFromClipOrDropData(items, 'image');
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  /**
   * When the image is unselected, this method filters out the recently deleted image.
   * @param imageIndex The index of the image that is deselected.
   */
  const onImageCancel = (imageIndex: number): void => {
    let newImages = images.filter((el, index) => index != imageIndex);
    setImages([...newImages]);
  };
  return (
    <div
      className="sm:w-full w-[95%] flex flex-col shadow-md mb-5 sm:mb-0 mx-1 sm:mx-0 px-4 py-3 absolute sm:relative bottom-0 bg-white rounded-3xl max-h-[200px]"
      onPaste={(e) => readImages(e.clipboardData.items)}
      onDrop={(e) => {
        e.preventDefault();
        readImages(e.dataTransfer.files);
      }}
    >
      {/* 
      ImageUploadsInChatBox is used to display the images that are uploaded into the chatbox area.
      */}
      <ImageUploadsInChatBox
        images={images}
        callback={onImageCancel}
        cancelRequired={true}
      />
      {/*
        TextArea is a component from Reusables that is present here in chatbox for user queries. Refer the component for props and functionality
         */}
      <TextArea
        placeholder="What do you want to know?"
        className="w-full min-h-10 mb-4 field-sizing-content resize-none px-1 pt-1 focus:none outline-none overscroll-contain placeholder:text-stone-400"
      />
      <div className="flex justify-between items-center mt-2">
        {/*
        FileInput is a component from Reusables that is present here for uploading images. Refer the component for props and functionality
         */}
        <FileInput
          className="w-7 h-7 p-1 cursor-pointer border-stone-300 fill-stone-400 hover:rotate-45"
          accept="image/png image/jpg image/jpeg"
          onChange={readImage}
        >
          <AttachSVG />
        </FileInput>

        {/*
        Button is a component from Reusables that is present here for submitting queries. Refer the component for props and functionality
         */}
        <Button className="relative hover:left-1 cursor-pointer">
          <SubmitSVG className="fill-stone-400" />
        </Button>
      </div>
    </div>
  );
};

ChatBox.displayName = 'ChatBox';
