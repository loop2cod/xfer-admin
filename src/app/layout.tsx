import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AdminTransferProvider } from "@/context/AdminTransferContext";
import { PendingCountProvider } from "@/context/PendingCountContext";
import { AdminLayoutWrapper } from "@/components/AdminLayoutWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Portal - Crypto Transfer Platform",
  description: "Administrative dashboard for Crypto Transfer Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider>
          <PendingCountProvider>
            <AdminTransferProvider>
                {children}
            </AdminTransferProvider>
          </PendingCountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
