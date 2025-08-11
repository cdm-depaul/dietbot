'use client';
import React, {
  memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, FileInput, TextArea } from '_reusables';
import { AttachSVG, SubmitSVG } from '_svgs';
import { ImageUploadsInChatBox } from './index';
import { readFromClipOrDropData } from './utils';
import { chatBoxInterface } from './interface';
import chatContext from '../_context/ChatContext';

const chatBoxReducer = (
  state: { images: string[]; query: string },
  payload:
    | { action: 'readImages'; value: string[] }
    | { action: 'readQuery'; value: string }
) => {
  switch (payload.action) {
    case 'readImages':
      return { ...state, images: payload.value };
    case 'readQuery':
      return { ...state, query: payload.value };
    default:
      return state;
  }
};

/**
 * Chat composer + uploads.
 */
export const ChatBox: React.FC<chatBoxInterface> = memo(
  ({ className, disableNavigate = false, onSubmitQuery }) => {
    const [{ images, query }, dispatch] = useReducer(chatBoxReducer, {
      images: [],
      query: '',
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Keep a stable session id when we stay inline
    const sessionIdRef = useRef<string | null>(null);

    const { postQuery } = useContext(chatContext);

    // Bootstrap session id from URL or localStorage (only for inline mode)
    useEffect(() => {
      if (!disableNavigate) return;
      const fromUrl = searchParams?.get('sid');
      if (fromUrl) {
        sessionIdRef.current = fromUrl;
        return;
      }
      const fromStorage = typeof window !== 'undefined' ? localStorage.getItem('dietbot.inline.sid') : null;
      if (fromStorage) {
        sessionIdRef.current = fromStorage;
        // ensure URL also has sid for any readers (e.g., ChatContext)
        try {
          const params = new URLSearchParams(searchParams?.toString());
          params.set('sid', fromStorage);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } catch {}
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disableNavigate]); // intentionally not depending on searchParams changes

    const ensureInlineSid = () => {
      if (sessionIdRef.current) return sessionIdRef.current;
      const sid = crypto.randomUUID();
      sessionIdRef.current = sid;
      try {
        // persist for page reloads and put in URL for consumers (Chat/Context)
        localStorage.setItem('dietbot.inline.sid', sid);
        const params = new URLSearchParams(searchParams?.toString());
        params.set('sid', sid);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      } catch {}
      return sid;
    };

    const readImage = useCallback((imageInput: FileList) => {
      const image_urls: string[] = [];
      for (let i = 0; i < imageInput.length; i++) {
        image_urls[i] = URL.createObjectURL(imageInput[i]);
      }
      dispatch({ action: 'readImages', value: [...images, ...image_urls] });
    }, [images]);

    const readImages = useCallback(async (items: DataTransferItemList | FileList) => {
      const newImages = await readFromClipOrDropData(items, 'image');
      dispatch({ action: 'readImages', value: [...images, ...newImages] });
    }, [images]);

    const onImageCancel = useCallback((imageIndex: number): void => {
      const newImages = images.filter((_, index) => index !== imageIndex);
      dispatch({ action: 'readImages', value: newImages });
    }, [images]);

    const textOnChange = useCallback(
      (text: string) => text !== '\n' && dispatch({ action: 'readQuery', value: text }),
      []
    );

    const onSubmit = () => {
      if (!query.trim()) return;

      // 1) Resolve the target session id
      const id = disableNavigate ? ensureInlineSid() : crypto.randomUUID();

      // 2) Send to backend (your ChatContext handles streaming/rendering)
      postQuery(query);
      onSubmitQuery?.(query, id);

      // 3) Clear input
      dispatch({ action: 'readQuery', value: '' });

      // 4) Classic navigation when allowed, otherwise we stay inline
      if (!disableNavigate) {
        router.push(`/chat/${id}`);
      }
    };

    const textOnEnter = useCallback((key: string) => {
      if (key === 'Enter') onSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, disableNavigate]);

    return (
      <div
        className={`sm:w-full w-[95%] flex flex-col shadow-md mb-5 mx-1 sm:mx-0 px-4 py-3 sm:relative bottom-0 bg-white rounded-3xl max-h-[200px] ${className ?? ''}`}
        onPaste={(e) => readImages(e.clipboardData.items)}
        onDrop={(e) => { e.preventDefault(); readImages(e.dataTransfer.files); }}
      >
        <ImageUploadsInChatBox
          images={images}
          callback={onImageCancel}
          cancelRequired={true}
        />

        <TextArea
          className="w-full min-h-10 mb-4 field-sizing-content resize-none px-1 pt-1 focus:none outline-none overscroll-contain placeholder:text-stone-400"
          placeholder="What do you want to know?"
          value={query}
          onChange={textOnChange}
          onKeyDown={textOnEnter}
        />

        <div className="flex justify-between items-center mt-2">
          <FileInput
            className="w-7 h-7 p-1 relative"
            accept="image/png image/jpg image/jpeg"
            onChange={readImage}
          >
            <AttachSVG className="before:content-['Attach_Files'] before:-translate-y-7 before:translate-x-15 " />
          </FileInput>

          <Button
            className="w-7 h-7 p-1 relative disabled:cursor-not-allowed"
            onClick={onSubmit}
          >
            <SubmitSVG className="before:content-['Submit'] before:-translate-y-7 before:-translate-x-15" />
          </Button>
        </div>
      </div>
    );
  }
);

ChatBox.displayName = '/_components/ChatBox';
export default ChatBox;
