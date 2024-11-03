"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaTelegram,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const GlassmorphicCard = ({ children, className }) => (
  <div
    className={`bg-neutral-800 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-6 ${className}`}
  >
    {children}
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-neutral-900  text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-neutral-700 h-full"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassmorphicCard>
                <img src="/epic.png" alt="Webtrix" className="h-8 mb-6" />
                <h2 className="text-2xl font-bold mb-4">
                  Get Started with Grey Matter – Your Smart Yield Solution Why
                  limit your yield?
                </h2>
                <p className="mb-4 text-neutral-300 text-sm">
                  Grey Matter bridges the gap to higher returns across the
                  blockchain landscape. Get started now and optimize your DeFi
                  strategies.
                </p>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="flex-grow bg-neutral-700 bg-opacity-50 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black font-semibold rounded-r-md py-2 px-6 transition duration-300 hover:bg-neutral-200 text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </GlassmorphicCard>
            </motion.div>
          </div>

          <div className="lg:w-2/3">
            <GlassmorphicCard className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  title: "Product",
                  links: [
                    "Invest Your Future",
                    "Find Our Stocks",
                    "Find Our Crypto",
                    "Earn Extra Money",
                    "Bank Smarter",
                  ],
                },
                {
                  title: "Who We Are",
                  links: [
                    "About Us",
                    "Careers",
                    "News And Media",
                    "Financial Statement",
                  ],
                },
                {
                  title: "Support",
                  links: [
                    "FAQs",
                    "Contacts",
                    "Mobile",
                    "Windows & Mac",
                    "Desktop Version",
                  ],
                },
                {
                  title: "Documentation",
                  links: [
                    "Publics URLs",
                    "Social Rooms",
                    "User Guide",
                    "Privacy Policy",
                  ],
                },
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="text-neutral-300 hover:text-white transition duration-300 text-sm"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </GlassmorphicCard>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center relative">
          <div className="absolute inset-x-0 bottom-0 h-24 opacity-5">
            <div className="grid grid-cols-12 h-full">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="border-r border-neutral-700 h-full"
                ></div>
              ))}
            </div>
          </div>

          <p className="text-neutral-500 text-sm">
            &copy; 2024, All Right Reserved
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[FaTwitter, FaTelegram, FaFacebookF, FaInstagram].map(
              (Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-neutral-400 hover:text-white transition duration-300"
                >
                  <Icon size={20} />
                </a>
              )
            )}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition duration-300 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition duration-300 text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
