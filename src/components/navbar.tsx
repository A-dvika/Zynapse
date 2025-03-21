"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "./ui/darkmode";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="z-50 lg:sticky max-w-[90%] m-auto lg:top-0">
      {/* iPad & Desktop Navbar */}
      <section className="flex w-full justify-between items-center m-auto p-2">
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
            className="h-6 w-6 text-blue-500"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          techtrends
        </Link>

        {/* Tabs */}
        <Tabs defaultValue="overview">
        <TabsList >
  <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600">Overview</TabsTrigger>
  <TabsTrigger value="github" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600">Github</TabsTrigger>
  <TabsTrigger value="reddit" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600">Reddit</TabsTrigger>
  <TabsTrigger value="stack-overflow" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600">Stack Overflow</TabsTrigger>
  <TabsTrigger value="hackernews" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600">HackerNews</TabsTrigger>
  <TabsTrigger value="socials" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600">Socials</TabsTrigger>
</TabsList>

        </Tabs>

        {/* Icons + Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
          <ModeToggle />
        </div>
      </section>

      {/* Mobile Navbar */}
      <section className="fixed z-50 md:w-[30rem] md:m-auto lg:hidden bottom-10 left-0 right-0 flex flex-wrap justify-center w-full">
        <div className="flex gap-3 flex-wrap items-center w-[60%] justify-between p-2 bg-black/20 dark:bg-white/5 backdrop-blur-lg rounded-xl">
          <ModeToggle />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
