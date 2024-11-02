"use client"
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { signIn } from "next-auth/react";

const AgentSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous error when user starts typing
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      // Handle successful signup
      // You might want to redirect to login page or automatically sign in the user
      console.log('Signup successful:', data);
      
      // Optional: Automatically sign in after successful signup
      await signIn("credentials", {
        redirect: true,
        username: formData.username,
        password: formData.password,
        callbackUrl: "/"
      });

    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-2">
        {/* Image Section */}
        <div className="relative h-[800px] w-full">
          <Image 
            src="/greymatterlogo.svg"
            alt="Agent Signup Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-4xl font-bold mb-4">Join Our Platform</h3>
              <p className="text-neutral-300">
                Create your account to access our aggregator
              </p>
            </div>
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="p-8 space-y-6 bg-black/30 backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-center text-white bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
            Create Account
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-neutral-300">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-neutral-300">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-neutral-300">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-neutral-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300 pr-12"
                  required
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
              disabled={isLoading}
              className="w-full py-3 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 border border-yellow-500/20 transition duration-300 flex items-center justify-center space-x-2 hover:border-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-300"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center text-neutral-400 flex items-center justify-center space-x-4 my-4">
            <div className="h-px bg-white/10 flex-grow"></div>
            <span className="text-sm">Or Sign up with</span>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => signIn("google", { callbackUrl: "/blog" })}
              className="bg-white/5 border border-white/10 text-white rounded-full p-3 hover:bg-white/10 transition duration-300 flex items-center justify-center"
            >
              <FaGoogle size={24} className="text-red-500" />
            </button>
          </div>

          <div className="text-center mt-4 text-neutral-400">
            Already have an account? {' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSignup;