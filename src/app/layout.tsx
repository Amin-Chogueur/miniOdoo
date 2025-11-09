"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/header/NavBar";
import QueryProvider from "@/query/providers";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Mini Odoo</title>
      </head>
      {
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            <NavBar />
            <main className="mt-14 max-w-7xl mx-auto p-4">{children}</main>
            <ToastContainer position="top-center" autoClose={3000} />
          </QueryProvider>
        </body>
      }
    </html>
  );
}
