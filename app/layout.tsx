import React from "react";
import "./globals.css";
import { withClerkProvider } from "../lib/clerk";

export const metadata = {
  title: "Dragon AI",
  description: "Dragon AI - Falcon-Dragon powered chat and image application.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/dragon.jpg" type="image/jpeg" />
      </head>
      <body className="h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
        {children}
      </body>
    </html>
  );
}

export default withClerkProvider(RootLayout);
