'use client';
import React, { memo, useCallback, useState, useMemo } from 'react';
import { Button, FileInput, TextArea } from '../_reusables';
import { AttachSVG, SubmitSVG } from '../_svgs';
import { ImageUploadsInChatBox } from './index';
import { readFromClipOrDropData } from './utils';
import { chatBoxInterface } from './interface';
/**
 *
 * Component that displays the chatbox on the screen.
 * Consists of ImageUploadsInChatBox,TextArea, FileInput components within.
 */
export const ChatBox: React.FC<chatBoxInterface> = memo(({ className }) => {
  const [images, setImages] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  console.log('chatBox');
  /**
   * This method is used here as it is passed as a callback to FileInput and creates a url for the image once the image is read and fed back.
   * @param imageInput FileList, that is returned by FileInput Component.
   */
  const readImage = useCallback(
    (imageInput: FileList) => {
      let image_urls = [];
      for (let i = 0; i < imageInput.length; i++) {
        image_urls[i] = URL.createObjectURL(imageInput[i]);
      }
      setImages((prevImages) => [...prevImages, ...image_urls]);
    },
    [images]
  );

  /**
   * Method used to read images onDrop or onPaste.
   * @param items
   */
  const readImages = useCallback(
    async (items: DataTransferItemList | FileList): Promise<void> => {
      const newImages = await readFromClipOrDropData(items, 'image');
      setImages((prevImages) => [...prevImages, ...newImages]);
    },
    [images]
  );
  /**
   * When the image is unselected, this method filters out the recently deleted image.
   * @param imageIndex The index of the image that is deselected.
   */
  const onImageCancel = useCallback(
    (imageIndex: number): void => {
      let newImages = images.filter((el, index) => index != imageIndex);
      setImages([...newImages]);
    },
    [images]
  );

  const textOnChange = useCallback(
    (text: string) => text !== '\n' && setQuery(text),
    [query]
  );

  const textOnEnter = useCallback(
    (key: string) => {
      // when user clicks enter.
      if (key === 'Enter') {
        setQuery('');
      }
    },
    [query]
  );

  return (
    <div
      className={`sm:w-full w-[95%] flex flex-col shadow-md mb-5 mx-1 sm:mx-0 px-4 py-3 absolute sm:relative bottom-0 bg-white rounded-3xl max-h-[200px] ${className}`}
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
        className="w-full min-h-10 mb-4 field-sizing-content resize-none px-1 pt-1 focus:none outline-none overscroll-contain placeholder:text-stone-400"
        placeholder="What do you want to know?"
        value={query}
        onChange={textOnChange}
        onKeyDown={textOnEnter}
      />
      <div className="flex justify-between items-center mt-2">
        {/*
        FileInput is a component from Reusables that is present here for uploading images. Refer the component for props and functionality
         */}
        <FileInput
          className="w-7 h-7 p-1 relative"
          accept="image/png image/jpg image/jpeg"
          onChange={readImage}
        >
          <AttachSVG className="before:content-['Attach_Files'] before:-translate-y-7 before:translate-x-15 " />
        </FileInput>

        {/*
        Button is a component from Reusables that is present here for submitting queries. Refer the component for props and functionality
         */}
        <Button
          disabled={images.length === 0 && query.length === 0 ? true : false}
          className="w-7 h-7 p-1 relative disabled:cursor-not-allowed"
          // onClick={() => console.log(query)}
        >
          <SubmitSVG className="before:content-['Submit'] before:-translate-y-7 before:-translate-x-15" />
        </Button>
      </div>
    </div>
  );
});

ChatBox.displayName = '/_components/ChatBox';
