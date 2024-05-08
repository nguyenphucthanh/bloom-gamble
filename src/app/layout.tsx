import { Providers } from "@/store/provider";
import "./globals.scss";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const robotoMono = Roboto_Mono({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: "Bloom Game",
  description: "Work Hard Play Harder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </head>
      <body className={robotoMono.className}>
        <div className="container py-8">
          <Providers>{children}</Providers>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
