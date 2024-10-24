"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function HeroTypo() {
  return (
    <>
    <motion.h1
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: [20, -5, 0],
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-400 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
    >
  
     
    </motion.h1>
    <div className=" relative text-center">

    </div>
    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 lg:text-4xl to-neutral-600 text-lg mt-6 md:text-3xl">Unleashing the power of cross-chain yield</p>
   <Highlight className=" font-bold text-lg text-neutral-400 p-2 mt-2 md:text-3xl lg:text-4xl">
   aggregation through wormhole.
   </Highlight>  
   </>
  );
}
