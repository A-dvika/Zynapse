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

  // Updated links array including "Dashboard"
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Overview", href: "/overview" },
    { name: "GitHub", href: "/github" },
    { name: "ProductHunt", href: "/producthunt" },
    { name: "Stack Overflow", href: "/stack-overflow" },
    { name: "HackerNews", href: "/hackernews" },
    { name: "Socials", href: "/socials" },
    {name: "For-Her" , href: "/for-her"},
  ];

  return (
    <>
      <nav className="w-full sticky top-0 bg-card dark:bg-neondark-card backdrop-blur-md shadow-sm text-foreground dark:text-neondark-text px-4 py-4">
        <section className="flex w-full justify-between items-center">
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
          <div className="hidden lg:flex gap-6 items-center">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium px-3 py-2 rounded-lg transition-colors 
                    ${active 
                      ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-700"}`
                  }
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Subscribe Button */}
            <Button variant="outline" onClick={() => setSubscribeModalOpen(true)}>
              Subscribe
            </Button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="px-4 py-2">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="px-4 py-2">
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/profile">
                <Button variant="outline" className="px-4 py-2">
                  Profile
                </Button>
              </Link>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <ModeToggle />

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden ml-4" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </section>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden flex flex-col gap-4 p-4 bg-card dark:bg-neondark-card rounded-xl shadow-md mx-2 mt-2 z-40">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-3 py-2 rounded-lg transition-colors 
                    ${active 
                      ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-700"}`
                  }
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Subscribe Button (Mobile) */}
            <Button
              variant="outline"
              className="w-full px-4 py-2"
              onClick={() => {
                setSubscribeModalOpen(true);
                setMenuOpen(false);
              }}
            >
              Subscribe
            </Button>

            {/* Mobile Auth Buttons */}
            {!isAuthenticated ? (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full px-4 py-2">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full px-4 py-2">
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full px-4 py-2">
                  Profile
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>

      <SubscribeModal open={!!subscribeModalOpen} onClose={() => setSubscribeModalOpen(false)} />
    </>
  );
};

export default Navbar;
