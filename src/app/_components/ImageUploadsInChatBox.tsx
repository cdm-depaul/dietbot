'use client';
import React, { memo, useState } from 'react';
import { imageDisplayInterface, imageUploadsInterface } from './interface';
import { Button } from '../_reusables';
import { CancelSVG } from '../_svgs';

export const ImageUploadsInChatBox: React.FC<imageUploadsInterface> = memo(
  ({ images, callback, cancelRequired }) => {
    console.log('ImageUploadsInChatBox');
    return (
      <div
        className={`flex max-h-16 overflow-y-scroll ${
          images.length ? 'visible' : 'hidden'
        } gap-3 flex-wrap pt-2`}
      >
        {images.map((el, index) => (
          <ImageDisplayInChatBox
            src={el}
            index={index}
            key={index}
            callback={callback}
            cancelRequired={cancelRequired}
          />
        ))}
      </div>
    );
  }
);

ImageUploadsInChatBox.displayName = '/_components/ImageUploadsInChatBox';

const ImageDisplayInChatBox: React.FC<imageDisplayInterface> = memo(
  ({ src, index, callback, cancelRequired }) => {
    const [isCancel, setCancel] = useState<boolean>(false);
    const setCancelDisplayStatus = (newState: boolean) =>
      cancelRequired && setCancel(newState);
    console.log('ImageDisplayInChatBox');
    return (
      <div
        className="relative rounded-xl"
        key={index}
        onMouseEnter={() => setCancelDisplayStatus(true)}
        onMouseLeave={() => setCancelDisplayStatus(false)}
        onTouchStart={() => setCancelDisplayStatus(true)}
      >
        <Button
          className={`w-3 h-3 absolute -top-1 right-1 cursor-pointer transition-all duration-200 ${
            cancelRequired && isCancel ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => callback && callback(index)}
        >
          <CancelSVG className="rounded-full p-0.5 max-w-5 max-h-5  !fill-red-400 !bg-red-200 !stroke-none  hover:bg-stone-300 !before:content-none hover-none" />
        </Button>

        <img className="w-14 h-14 rounded-xl" src={src} />
      </div>
    );
  }
);
