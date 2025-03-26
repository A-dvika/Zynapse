import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import FloatingChatbot from "./FloatingChatbot/page";

// Removed unused font variables to fix eslint errors

export const metadata: Metadata = {
  title: "Zynapse",
  description: "synapse → connecting tech ideas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* NavBar (always visible) */}
          <Navbar />

          {/* Your main page content */}
          {children}

          {/* Floating Chatbot on all pages */}
          <FloatingChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
