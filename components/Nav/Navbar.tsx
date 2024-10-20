"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

const SideNav = ({ isOpen }: { isOpen: boolean }) => {
  const nav = {
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };
  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-0 top-0 bottom-0 w-full bg-black/20 backdrop-blur-xl  pt-24"
          variants={nav}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.ul className="flex flex-col  text-white">
            {["Home", "Dashboard", "Portfolio", "About"].map((text, index) => (
              <motion.li
                key={text}
                variants={item}
                className="cursor-pointer text-2xl hover:text-gray-300 w-full py-6 px-6 border-b border-gray-200/50 hover:backdrop-blur-3xl hover:bg-blue-600/30 "
              >
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function Navbar({ children }: { children: React.ReactNode }) {
  const [sideNav, setSideNav] = useState<boolean>(false);

  return (
    <>
      <div className="fixed w-full md:py-6 z-10 bg-gray-900/30 backdrop-blur-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-white">Grey Matter</h1>
            <Image src="/placeholder.png" alt="Logo" width={20} height={20} />
          </div>
          <div className="flex flex-row gap-2">
            <motion.button
              whileHover={{
                scale: 1.2,
                color: "#1d4ed8",
                transition: {
                  type: "spring",
                },
              }}
              whileTap={{
                borderRadius: "50%",
                scale: 1.2,
                transition: {
                  type: "spring",
                  delay: 0.2,
                  bounce: 1.5,
                },
              }}
              className="px-4 py-2 rounded-3xl text-white text-sm font-medium flex items-center justify-center text-center bg-blue-600"
            >
              Dashboard
            </motion.button>
            <motion.button
              onClick={() => setSideNav((prev) => !prev)}
              className="md:hidden flex flex-col space-y-2 p-2 items-end"
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className={`w-7 h-[0.08rem] bg-white`}
                animate={{ rotate: sideNav ? 45 : 0, y: sideNav ? 5 : 0 }}
              />

              <motion.div
                className={`w-4 ${sideNav && "w-7"} h-[0.08rem] bg-white`}
                animate={{ rotate: sideNav ? -45 : 0, y: sideNav ? -6 : 0 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
      <SideNav isOpen={sideNav} />
      <div className="pt-16">{children}</div>
    </>
  );
}

export default Navbar;
