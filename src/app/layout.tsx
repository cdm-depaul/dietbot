import './globals.css';
import { Navbar } from './_components';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
