'use client';
import { Navbar } from './_components';
import { ChatContextProvider } from './_context/ChatContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        
        
      </head>
      <body>
        <ChatContextProvider>
          <Navbar />
          {children}
        </ChatContextProvider>
      </body>
    </html>
  );
}
