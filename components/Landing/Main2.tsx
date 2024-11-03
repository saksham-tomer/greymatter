"use client";
import React from "react";
import RetroGrid from "../ui/retro-grid";
import { HeroTypo } from "./HeroTypo";
import { HeroButton } from "./HeroButton";
import { Meteors } from "../ui/meteors";
import { InfiniteMovingCardsDemo } from "./Marquee";
import { ParticlesDemo } from "./Particles";
import { ThreeDCardDemo } from "./3dCard";
import FAQSection from "./FaqSecton";
import Footer from "./Footer";
import { useRouter } from "next/navigation";

function Main2() {
  const router = useRouter();
  return (
    <div>
      <div className="relative bg-gradient-to-b from-neutral-950 to-neutral-900 min-w-full flex min-h-screen w-full flex-col items-center justify-center overflow-hidden  bg-background md:shadow-xl">
        <Meteors number={20} />
        <span className="mt-40 pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-neutral-100 via-neutral-400 to-neutral-700 bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
          Grey Matter
        </span>
        <HeroTypo />
        <HeroButton />
        <RetroGrid />
        <InfiniteMovingCardsDemo />
      </div>
      <ParticlesDemo />
      <div className="min-h-full flex flex-col md:flex-row bg-gradient-to-b  pt-20 from-neutral-950 to-neutral-900 items-center justify-center min-w-full bg-">
        <div className="w-1/2 pl-4 md:pl-8 lg:pl-16 xl:pl-24 flex flex-col gap-4">
          <h1 className="text-4xl md:text-6xl text-transparent xl:text-8xl lg:text-7xl bg-clip-text bg-gradient-to-tr from-neutral-400 to-neutral-700">
            No Rocket Science, Just Easy Yields
          </h1>
          <p className="text-wrap text-justify xl:text-lg max-w-3xl text-neutral-300 mt-4">
            Grey Matter aims to be a cross-chain heaven for yield farming
            enthusiasts. Find the best yield across chains, move your funds,
            invest, and track - all from one platform!
          </p>
          <button
            onClick={() => {
              router.push("/stake");
            }}
            className="px-7 py-3 transition-colors duration-300  bg-white text-black rounded-3xl shadow-md hover:bg-neutral-300 mt-4 max-w-[14rem] font-semibold"
          >
            Get Started
          </button>
        </div>
        <div className="w-1/2">
          <ThreeDCardDemo />
        </div>
      </div>
      <FAQSection />
      <Footer />
    </div>
  );
}

export default Main2;
