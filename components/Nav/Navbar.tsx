"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ChevronDown } from "lucide-react";

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-neutral-400 hover:text-white transition-colors duration-300"
  >
    {children}
  </a>
);

const UserDropdown = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded-md"
      >
        <Image
          height={24}
          width={24}
          src={session.user.image? session.user.image:"https://avatars.githubusercontent.com/u/115660976?s=400&u=a81ec7c3ac47828435923839d77a659302962e97&v=4"}
          alt={session.user.name}
          className="rounded-full"
        />
        <span>{session.user.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-50"
          >
            <a
              href="/dashboard"
              className="block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
            >
              Dashboard
            </a>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors duration-200"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const { data: session, status } = useSession();
  console.log(session)

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Stake", href: "/stake" },
    { name: "Features", href: "#" },
    { name: "FAQ", href: "/aboutus" },
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
            {status === "authenticated" ? (
              <UserDropdown session={session} />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Create Account
              </motion.button>
            )}
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
                {status === "authenticated" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <Image
                        height={32}
                        width={32}
                        src={session.user.image}
                        alt="Profile"
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">{session.user.name}</span>
                    </div>
                    <a
                      href="/dashboard"
                      className="block w-full text-left px-2 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded-md"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-2 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Create Account
                  </motion.button>
                )}
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