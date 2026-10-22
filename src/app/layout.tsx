import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Loader from "@/components/custom/Loader";
import { LoadingProvider } from "@/hooks/use-loading";
import GlobalLoader from "@/components/custom/Loader";
import { CookiesProvider } from "react-cookie";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

import { GYM_BRANDING } from "@/config/branding";

export const metadata: Metadata = {
  title: `${GYM_BRANDING.name} - ${GYM_BRANDING.tagline}`,
  description: `Modern management platform for ${GYM_BRANDING.name}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta property="og:image" content="/logo.png"/>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png"/>
      </head>
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
          >
        
          <LoadingProvider>
            <GlobalLoader />
            {children}
          </LoadingProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
