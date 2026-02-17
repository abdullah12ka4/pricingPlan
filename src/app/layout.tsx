import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description: "Skiltrak Pricing & Plans Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${inter.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
