"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/darkmode";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const links = [
    { name: "Overview", href: "/overview" },
    { name: "Github", href: "/github" },
    { name: "ProductHunt", href: "/producthunt" },
    { name: "Stack Overflow", href: "/stack-overflow" },
    { name: "HackerNews", href: "/hackernews" },
    { name: "Socials", href: "/socials" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email }); // Hook this to your API
    setShowModal(false);
    setName("");
    setEmail("");
  };

  return (
    <>
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
            Zynapse
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

          {/* ✅ Gradient Subscribe Button */}
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow hover:from-blue-600 hover:to-purple-600 transition hidden lg:block"
          >
            Subscribe
          </Button>

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

      {/* ✅ Subscribe Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-black rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Subscribe to Newsletter
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                Get the latest tech trends, updates & insights delivered straight to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Subscribe Now
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
