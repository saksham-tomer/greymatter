"use client"
import React, { useState } from 'react';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { signIn } from "next-auth/react";

const AgentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-2">
        {/* Image Section */}
        <div className="relative h-[700px] w-full">
          <Image 
            src="/greymatterlogo.svg"  // Replace with your actual image path
            alt="Agent Login Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-4xl font-bold mb-4">Welcome Back</h3>
              <p className="text-neutral-300">
                Enter your credentials to access our aggregator
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="p-8 space-y-6 bg-black/30 backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-center text-white bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
            Agent Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-neutral-300">Email / Phone No</label>
              <input
                type="text"
                placeholder="Enter Email / Phone No"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-neutral-300">Passcode</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button  
              type="submit" 
              className="w-full py-3 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 border border-yellow-500/20 transition duration-300 flex items-center justify-center space-x-2 hover:border-yellow-500/30"
              onClick={(e)=>{

                 signIn("credentials", {
                  redirect: false,
                  username: email,
                password:  password,
                });
            

              }} >
              Sign In
            </button>
          </form>

          <div className="text-center text-neutral-400 flex items-center justify-center space-x-4 my-4">
            <div className="h-px bg-white/10 flex-grow"></div>
            <span className="text-sm">Or Sign in with</span>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          <div className="flex justify-center space-x-4">
            {[
              { Icon: FaGoogle, color: 'text-red-500' },
            ].map(({ Icon, color }, index) => (
              <button  onClick={(e)=>{
                e.preventDefault()

                signIn("google", { callbackUrl: "/blog" });
              }}
                key={index}
                className="bg-white/5 border border-white/10 text-white rounded-full p-3 hover:bg-white/10 transition duration-300 flex items-center justify-center"
              >
                <Icon size={24} className={color} />
              </button>
            ))}
          </div>

          <div className="text-center mt-4 text-neutral-400">
            Don't have an account? {' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition">
              Request Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;