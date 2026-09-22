import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Full stack Blog Admin",
  description: "Administration of Full Stack Blog",
};

/**
 * Wraps the admin app with the shared layout and global font styles.
 *
 * @param {{ children: React.ReactNode }} props - The page content to render inside the admin layout.
 * @returns {JSX.Element} The HTML structure for the admin application shell.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
