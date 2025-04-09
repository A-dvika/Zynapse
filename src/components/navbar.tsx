"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/darkmode";
import { Menu, X, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import SubscribeModal from "./SubscribeModal";

const Navbar = () => {
  // Always call hooks at the top.
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = React.useState(false);

  // Conditionally render a loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-16 bg-background">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-primary/20 h-8 w-8"></div>
          <div className="flex-1 space-y-2 py-1 w-48">
            <div className="h-2 bg-primary/20 rounded"></div>
            <div className="h-2 bg-primary/20 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const isAuthenticated = status === "authenticated";

  // Common navigation links shown for all users
  const links = [
    { name: "Home", href: "/overview" },
    { name: "Repos", href: "/github" },
    { name: "Launches", href: "/producthunt" },
    { name: "Q&A", href: "/stack-overflow" },
    { name: "News", href: "/hackernews" },
    { name: "Buzz", href: "/socials" },
  ];

  return (
    <>
      <nav className="z-50 w-full sticky top-0 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4">
          <section className="flex w-full justify-between items-center py-4 border-b dark:border-cyan-900/30 border-cyan-100">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl group">
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
                className="h-7 w-7 text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-transparent bg-clip-text font-bold">
                Zynapse
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex gap-1 items-center">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 ${
                    pathname === link.href
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-gray-700 dark:text-gray-300"
                  } ${
                    pathname === link.href
                      ? "after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:bg-cyan-500 dark:after:bg-cyan-400"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* Add Dashboard link for authenticated users */}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 ${
                    pathname === "/dashboard"
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-gray-700 dark:text-gray-300"
                  } ${
                    pathname === "/dashboard"
                      ? "after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:bg-cyan-500 dark:after:bg-cyan-400"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                {/* Subscribe Button */}
                <Button 
                  onClick={() => setSubscribeModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Subscribe
                </Button>
                
                {!isAuthenticated ? (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="border-cyan-200 dark:border-cyan-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/30">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/40 dark:text-cyan-300 border-none">
                        Signup
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/profile">
                    <Button 
                      variant="outline" 
                      className="border-cyan-200 dark:border-cyan-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {session?.user?.name?.[0] || "U"}
                      </div>
                      Profile
                    </Button>
                  </Link>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-1">
                <ModeToggle />
              </div>

              {/* Hamburger Icon for Mobile */}
              <button 
                className="lg:hidden ml-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </section>
        </div>

        {/* Mobile Hamburger Menu */}
        {menuOpen && (
          <div className="lg:hidden flex flex-col gap-3 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border-t border-gray-100 dark:border-gray-800">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Add Dashboard link for mobile when authenticated */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                }`}
              >
                Dashboard
              </Link>
            )}
            
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-1"></div>
            
            {/* Mobile Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center border-cyan-200 dark:border-cyan-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/30">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full justify-center bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/40 dark:text-cyan-300 border-none">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full justify-center border-cyan-200 dark:border-cyan-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                  Profile
                </Button>
              </Link>
            )}
            
            {/* Subscribe Button for Mobile */}
            <Button
              onClick={() => {
                setSubscribeModalOpen(true);
                setMenuOpen(false);
              }}
              className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              Subscribe
            </Button>
          </div>
        )}
      </nav>
      <SubscribeModal open={subscribeModalOpen} onClose={() => setSubscribeModalOpen(false)} />
    </>
  );
};

export default Navbar;