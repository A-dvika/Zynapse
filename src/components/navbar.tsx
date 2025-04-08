"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/darkmode";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import SubscribeModal from "./SubscribeModal";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = React.useState(false);

  
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Overview", href: "/overview" },
    { name: "GitHub", href: "/github" },
    { name: "Launches", href: "/producthunt" },
    { name: "Dev Q&A", href: "/stack-overflow" },
    { name: "Hacker News", href: "/hackernews" },
    { name: "Social Feed", href: "/socials" },
  ];
  return (
    <>
      {/* 
        Neon / Cyberpunk-inspired Navbar
        Replace bg-card/dark:bg-neondark-card with your actual theme tokens
        if you use something like bg-background/dark:bg-neondark-bg, 
        or whichever suits your setup best.
      */}
      <nav className="z-50 max-w-[90%] m-auto sticky top-0 
                     bg-card dark:bg-neondark-card 
                     backdrop-blur-md rounded-b-xl shadow-sm
                     text-foreground dark:text-neondark-text">
        <section className="flex w-full justify-between items-center p-4">
          {/* Logo */}
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
              className="h-6 w-6 text-cyan-400"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Zynapse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-2 items-center">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium px-3 py-2 rounded-lg 
                              transition-colors
                              ${
                                active
                                  ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-700"
                              }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Subscribe Link */}
            <button
              onClick={() => setSubscribeModalOpen(true)}
              className={`text-base font-medium px-3 py-2 rounded-lg 
                          transition-colors
                          text-gray-700 dark:text-gray-300 
                          hover:bg-cyan-50 dark:hover:bg-cyan-700`}
            >
              Subscribe
            </button>

            {/* Auth Links */}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className={`text-base font-medium px-3 py-2 rounded-lg 
                              transition-colors
                              ${
                                pathname === "/login"
                                  ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                  : "text-gray-700 dark:text-gray-300 " +
                                    "hover:bg-cyan-50 dark:hover:bg-cyan-700"
                              }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`text-base font-medium px-3 py-2 rounded-lg 
                              transition-colors
                              ${
                                pathname === "/signup"
                                  ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                  : "text-gray-700 dark:text-gray-300 " +
                                    "hover:bg-cyan-50 dark:hover:bg-cyan-700"
                              }`}
                >
                  Signup
                </Link>
              </>
            ) : (
              <Link
                href="/profile"
                className={`text-base font-medium px-3 py-2 rounded-lg 
                            transition-colors
                            ${
                              pathname === "/profile"
                                ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                : "text-gray-700 dark:text-gray-300 " +
                                  "hover:bg-cyan-50 dark:hover:bg-cyan-700"
                            }`}
              >
                Profile
              </Link>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden ml-2" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </section>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden flex flex-col gap-2 p-4 
                          bg-card dark:bg-neondark-card 
                          rounded-xl shadow-md mx-4 mt-2 z-40">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-3 py-2 rounded-lg 
                              transition-colors
                              ${
                                active
                                  ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-700"
                              }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Subscribe Button (Mobile) */}
            <button
              onClick={() => {
                setSubscribeModalOpen(true);
                setMenuOpen(false);
              }}
              className={`text-base font-medium px-3 py-2 rounded-lg 
                          transition-colors text-left
                          text-gray-700 dark:text-gray-300 
                          hover:bg-cyan-50 dark:hover:bg-cyan-700`}
            >
              Subscribe
            </button>

            {/* Mobile Auth Links */}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-3 py-2 rounded-lg 
                              transition-colors block
                              ${
                                pathname === "/login"
                                  ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                  : "text-gray-700 dark:text-gray-300 " +
                                    "hover:bg-cyan-50 dark:hover:bg-cyan-700"
                              }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-3 py-2 rounded-lg 
                              transition-colors block
                              ${
                                pathname === "/signup"
                                  ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                  : "text-gray-700 dark:text-gray-300 " +
                                    "hover:bg-cyan-50 dark:hover:bg-cyan-700"
                              }`}
                >
                  Signup
                </Link>
              </>
            ) : (
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium px-3 py-2 rounded-lg 
                            transition-colors block
                            ${
                              pathname === "/profile"
                                ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
                                : "text-gray-700 dark:text-gray-300 " +
                                  "hover:bg-cyan-50 dark:hover:bg-cyan-700"
                            }`}
              >
                Profile
              </Link>
            )}
          </div>
        )}
      </nav>

      <SubscribeModal
        open={!!subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
      />
    </>
  );
};

export default Navbar;