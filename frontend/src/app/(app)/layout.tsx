'use client';
import { Navbar } from './_components';
import { ChatContextProvider } from './_context/ChatContext';

/**
 *
 * Start of the dietbot. Consists of Navbar and body which changes either to Homepage that is rendered on visit and chat page when conversation starts.
 * Next js uses the concept of layout and pages when we have routing involved. Here Navbar is fixed since it must be displayed across all pages.
 * @returns null
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChatContextProvider>
          <Navbar />
          {children}
        </ChatContextProvider>
      </body>
    </html>
  );
}
