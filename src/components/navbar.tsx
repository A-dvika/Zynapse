"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/darkmode";


const Navbar = () => {
    const pathname = usePathname();
    return (
        <nav className="z-50 lg:sticky max-w-[90%] m-auto lg:top-0">
            {/* iPad & Desktop Navbar */}
            <section className="flex w-full justify-between items-center m-auto p-2">
              
                <ModeToggle />
            </section>
            {/* Mobile Navbar */}
            <section className="fixed z-50 md:w-[30rem] md:m-auto lg:hidden bottom-10 left-0 right-0 flex flex-wrap justify-center w-full">
                <div className="flex gap-3 flex-wrap items-center w-[60%] justify-between p-2 bg-black/20 dark:bg-white/5 backdrop-blur-lg">
                  
                </div>
            </section>
        </nav>
    );
};

export default Navbar;