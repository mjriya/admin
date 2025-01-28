"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useSidebarStore from "../store/useSidebarStore";
import AuthProvider from "../components/AuthProvider";
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';

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

export default function RootLayout({ children }) {
  const { collapsed } = useSidebarStore();

  return (
    <html lang="en">
      <body className={`bg-white ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <Sidebar />
          <div className={`${collapsed ? 'ml-16' : 'ml-64'} p-0 transition-all duration-300`}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
