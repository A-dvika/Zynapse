"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/darkmode";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Overview", href: "/overview" },
    { name: "Github", href: "/github" },
    { name: "ProductHunt", href: "/producthunt" },
    { name: "Stack Overflow", href: "/stack-overflow" },
    { name: "HackerNews", href: "/hackernews" },
    { name: "Socials", href: "/socials" },
  ];

  return (
    <nav className="z-50 max-w-[90%] m-auto sticky top-0 bg-white dark:bg-black/30 backdrop-blur-md rounded-b-xl shadow-sm">
      <section className="flex w-full justify-between items-center p-4">
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

        {/* ✅ Hamburger Icon */}
        <button
          className="lg:hidden ml-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </section>

      {/* ✅ Mobile Hamburger Menu */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-4 p-4 bg-white dark:bg-black/80 rounded-xl shadow-md mx-4 mt-2 z-40">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
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
      )}
    </nav>
  );
};

export default Navbar;
