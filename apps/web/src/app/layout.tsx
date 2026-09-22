// import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { ThemeProvider } from "../components/Themes/ThemeContext";
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
  title: "Full-Stack Blog",
  description: "Blog about full stack development",
};

/**
 * Creates the site-wide layout and applies the saved theme preference from cookies.
 *
 * @param {{ children: React.ReactNode }} props - The page content to render within the root HTML layout.
 * @returns {Promise<JSX.Element>} The HTML document shell with the selected theme and global app providers.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverCookies = await cookies();
  const theme = serverCookies.get("theme")?.value || "light";

  return (
    <html lang="en" data-theme={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--background)] text-[var(--foreground)] transition-colors`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
