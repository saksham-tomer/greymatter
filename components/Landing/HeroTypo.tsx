"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";

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
      <h1 className="mb-2 mt-4"> Unleashing the power of cross-chain yield aggregation through
wormhole
</h1>
     
    </motion.h1>
     {/* <Highlight className="text-black  dark:text-white">
     Get best Prices
   </Highlight> */}
   </>
  );
}
