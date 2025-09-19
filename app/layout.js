"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200 dark:bg-gray-950 transition-colors duration-300`}
      >
        <Toaster position="top-center" reverseOrder={false} />

        {/* Modern dark mode button at bottom-left */}
        <button
          onClick={toggleTheme}
          className="fixed no-print bottom-16 z-50 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-yellow-500 dark:text-yellow-400 shadow-lg hover:scale-110 transition-transform duration-200"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {children}
      </body>
    </html>
  );
}
