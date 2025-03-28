'use client';
import React, { memo } from 'react';
import Link from 'next/link';
import { ChatHistory, Settings } from './index';
import { NewChatSVG } from '../_svgs';

/**
 * Renders a Navbar that is shared across all the pages and routes.
 * Contains company name that is static as of now, as in could be changed to image that could be taken as a prop
 * Displays a icon for new chat, that redirects to homepage.
 * Displays a history icon, that displays all the previous chats.
 * Displays a settings icon, for settings and profile related queries.
 * @returns JSX
 */
export const Navbar = memo(() => {
  return (
    <div className="w-full z-10 absolute top-0 flex justify-between items-center p-3">
      <span>Name</span>
      <div className="flex items-center gap-5 ">
        <Link href="/" className="w-9 h-9 p-1.5  relative rounded-full ">
          <NewChatSVG className="before:content-['New_Chat']" />
        </Link>
        <ChatHistory />
        <Settings />
      </div>
    </div>
  );
});
