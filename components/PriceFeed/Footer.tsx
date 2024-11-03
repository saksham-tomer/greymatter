"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaTelegram,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 pt-14  text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-neutral-700 h-full"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
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
