"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react"
import Image from "next/image";
import { signOut } from "next-auth/react";
const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-neutral-400 hover:text-white transition-colors duration-300"
  >
    {children}
  </a>
);

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { data: session, status } = useSession()
console.log(session, status)

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Technology", href: "#" },
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  return (
    <nav className="bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center">
              <div className="w-6 h-6 bg-white flex items-center justify-center">
                <div className="w-4 h-4 bg-neutral-900"></div>
              </div>
              <span className="ml-2 text-xl font-semibold">GreyMatter.</span>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.name} href={item.href}>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <motion.button
whileHover={status === "authenticated" ? {} : { scale: 1.05 }}
whileTap={status === "authenticated" ? {} : { scale: 0.95 }}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded-md"
            >
                { status=="authenticated" ?  
                <>
                 <div className=" flex gap-10">
                <div>{session.user.name}</div>
                <Image height={30} width={30} src={session.user.image}/>
                <div className=" border-2 border-black" onClick={(e)=>{
                  e.preventDefault()
                  signOut()
                }}> Logout</div>
                </div>

                </>
                
                   :  "Create Account"}
                </motion.button>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isSidebarOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-neutral-800 z-50"
          >
            <div className="pt-5 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  {item.name}
                </a>
              ))}
              <div className="px-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2 px-4 rounded-md"
                >
                { status=="authenticated" ?   JSON.stringify(session)   :  "Create Account"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </nav>
  );
};

export default Navbar;
