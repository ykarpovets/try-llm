import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Try LLM Next App",
  description: "Sample of RAG GenAI to generate summary of candidates CV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="flex flex-col w-screen pt-10 container mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}