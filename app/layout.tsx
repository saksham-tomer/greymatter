import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Nav/Navbar";
import ChatPopup from "@/components/chat";
import Footer from "@/components/Landing/Footer";
import { SessionProvider } from "@/provider/provider";
import { WalletProvider } from "@/components/Nav/Web3Wallet";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Grey Matter",
  description: "Defi Cross-Chain aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <WalletProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ChatPopup />
            <Navbar />
            {children}
          </body>
        </WalletProvider>
      </SessionProvider>
    </html>
  );
}
