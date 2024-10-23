"use client";

import { animate, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-full md:mt-48 mt-28 rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
      <motion.button
        whileHover={{
          scale: 1.05,
          translateX: -2,
          skew: 2,
          transition: {
            duration: 2,
            type: "spring",
            bounce: 2,
          },
        }}
        className="bg-gradient-to-tr px-6 py-1 border mb-4 border-neutral-500  rounded-3xl from-neutral-800 to-neutral-900 "
      >
        <h3 className="bg-clip-text text-transparent bg-gradient-to-tr from-neutral-200 to-neutral-500 font-semibold">
          Our Partners
        </h3>
      </motion.button>
      <p className="bg-clip-text text-transparent bg-gradient-to-tr from-neutral-300 to-neutral-500 font-semibold text-2xl ">
        Leading the Way in Crypto Trust With Wormhole
      </p>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote: "/epic.svg",  },
  {
    quote: "/epic1.svg",
  },
  {
    quote: "/epic2.svg",
  },
  {
    quote: "/epic3.svg",
  },
  {
    quote: "/epic4.svg",
  },
];
