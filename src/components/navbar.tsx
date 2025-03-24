"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/darkmode";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/overview" },
    { name: "Github", href: "/github" },
    { name: "ProductHunt", href: "/producthunt" },
    { name: "Stack Overflow", href: "/stack-overflow" },
    { name: "HackerNews", href: "/hackernews" },
    { name: "Socials", href: "/socials" },
  ];

  return (
    <nav className="z-50 lg:sticky max-w-[90%] m-auto lg:top-0">
      {/* Desktop Navbar */}
      <section className="flex w-full justify-between items-center m-auto p-2">
        {/* ✅ Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-blue-500"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          techtrends
        </Link>

        {/* ✅ Desktop Links */}
        <div className="hidden lg:flex gap-6 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                pathname === link.href
                  ? "bg-white dark:bg-gray-900 text-blue-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ✅ Dark Mode Toggle */}
        <ModeToggle />
      </section>

      {/* ✅ Mobile Navbar */}
      <section className="fixed z-50 md:w-[30rem] md:m-auto lg:hidden bottom-10 left-0 right-0 flex flex-wrap justify-center w-full">
        <div className="flex gap-3 flex-wrap items-center w-[80%] justify-between p-3 bg-black/20 dark:bg-white/5 backdrop-blur-lg rounded-xl">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                pathname === link.href
                  ? "bg-white dark:bg-gray-900 text-blue-600"
                  : "text-gray-100 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
