"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var scale-105 md:scale-110"> {/* Slightly larger on load */}
      <CardBody className="bg-transparent relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-transparent dark:border-white border-black/[0.1] w-full sm:w-[32rem] md:w-[38rem] h-auto rounded-2xl p-8 border transition-all duration-300 ease-in-out">
      
      

        <CardItem translateZ="100" className="w-full mt-6">
          <Image
            src="/assests/image.png" // ✅ Make sure image is in /public/assets
            height={1200}
            width={1600}
            className="h-[18rem] md:h-[22rem] w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>

        <div className="flex justify-between items-center mt-12">
          <CardItem
            translateZ={20}
            as={Link}
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-5 py-2 rounded-xl text-sm font-medium dark:text-white"
          >
            Try now →
          </CardItem>

          <CardItem
            translateZ={20}
            as="button"
            className="px-5 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-semibold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
