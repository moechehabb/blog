import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSessionUser } from "@/lib/session";
import Link from "next/link";
import { signOut } from "./actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Local Events",
  description: "Find and create local events",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const user = await getSessionUser()
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
                    <div className="flex justify-between w-full p-4">
                      <Link href="/">
        <h1>Welcome, {user?.name || user?.email}!</h1>
        </Link>
        {user ? (
          <div className="flex flex-row gap-x-2">
            <Link href={`/user/${user.id}`}>
            <p>Profile</p>
            </Link>
         <form action={signOut}>
            <button className="cursor-pointer" type="submit">Sign Out</button>
          </form>
          </div>
        ) : (
          <Link href="/login">Sign In</Link>
        )}
      </div>
        {children}
        </body>
    </html>
  );
}
