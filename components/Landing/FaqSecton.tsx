"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPinDemo } from "./FaqCard";

const FAQSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const faqItems = [
    {
      title: "What is Grey Matter?",
      content:"Grey Matter is a next-gen cross-chain yield aggregator, leveraging SOON to unlock the best yield opportunities in the DeFi space. Maximize your returns with the power of seamless cross-chain integration.",
    },
    {
      title: "How do I start using Grey Matter?",
      content:
        "To start using Webtrix, you'll need to create an account on our platform. Once registered, you can connect your cryptocurrency wallet, such as MetaMask, to interact with our services. From there, you can explore various features like providing liquidity to pools, staking tokens, and more.",
    },
    {
      title: "What are the benefits of using Grey Matter?",
      content:
        "Webtrix offers several benefits including enhanced security, transparent transactions, reduced fees, and access to a wide range of DeFi services. Our platform is designed to be user-friendly, making it easier for both beginners and experienced users to participate in the blockchain ecosystem.",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % faqItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + faqItems.length) % faqItems.length
    );
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center text-white relative overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 animate-gradient"></div>
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="w-full max-w-[95%] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 xl:w-3/5">
            <div className="text-left mb-8 lg:mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 lg:mb-4">
                Have a Question?
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light">
                We&apos;ve Got Your Answers.
              </h2>
            </div>

            <div className="mb-8 lg:mb-12">
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6">
              Need clarity? Our detailed FAQ section provides straightforward answers, whether you're a
DeFi newcomer or a seasoned pro.

              </p>
              <button className="bg-white text-neutral-900 px-6 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-200 transition-colors">
                Read More
              </button>
            </div>

            <div
              className="relative overflow-hidden mb-8 lg:mb-12"
              style={{ minHeight: "200px" }}
            >
              <AnimatePresence initial={false} custom={currentIndex}>
                <motion.div
                  key={currentIndex}
                  custom={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute w-full"
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4">
                    {faqItems[currentIndex].title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-300">
                    {faqItems[currentIndex].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-start">
              <button
                onClick={prevSlide}
                className="p-3 sm:p-4 bg-neutral-700 rounded-full mr-4 hover:bg-neutral-600 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 sm:p-4 bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 xl:w-2/5 flex justify-center items-center">
            <AnimatedPinDemo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
