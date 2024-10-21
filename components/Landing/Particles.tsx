"use client";

import { useEffect, useState } from "react";

import Particles from "@/components/ui/particles";
import { BentoDemo } from "./SectionBento";
import { ScrollBasedVelocityDemo } from "./ScrollSec";

export function ParticlesDemo() {
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor("#ffffff");
  }, []);

  return (
    <div className="relative pb-56 min-h-screen bg-gradient-to-b  pt-20 from-neutral-950 to-neutral-900 flex h-screen w-full flex-col items-center justify-center overflow-hidden  bg-background md:shadow-xl">
      <span className="pointer-events-none mt-32  whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Features of Grey Matter
      </span>
      <p className="text-base max-w-xl text-center  text-gray-400 font-medium mt-4 mb-12 ">
        Our Platform combines advance security, real time analytics,and
        user-friendly design to provide an unparalleled trading experience
      </p>
      <div className="max-w-5xl">
        <BentoDemo />
      </div>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <ScrollBasedVelocityDemo />
    </div>
  );
}
