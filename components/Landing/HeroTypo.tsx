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



     <Highlight className="text-white text-2xl tet-wrap w-[400px] mt-4 text-center   dark:text-white">
     Unleashing the power of cross-chain yield aggregation through wormhole.

   </Highlight>
   </>
  );
}
