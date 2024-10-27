"use client"
import { Globe } from "lucide-react";
import React from "react";

export default function LoginForm() {
    return (
        <div className="relative bg-gradient-to-b from-neutral-950 to-neutral-900 min-h-screen flex items-center justify-center text-neutral-100">
            <form
                className="flex flex-col items-center space-y-6 bg-neutral-800 bg-opacity-70 p-8 rounded-xl shadow-lg w-[350px] border border-neutral-700"
                onSubmit={(e) => e.preventDefault()}
            >
                <h1 className="text-4xl font-bold bg-gradient-to-br from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                    Login
                </h1>

                <div className="w-full space-y-3">
                    <label className="block text-sm text-neutral-300">Username</label>
                    <input
                        type="text"
                        placeholder="Username..."
                        className="w-full px-4 py-2 bg-black text-white rounded-lg focus:outline-none"
                    />
                </div>

                <div className="w-full space-y-3">
                    <label className="block text-sm  text-neutral-300">Password</label>
                    <input
                        type="password"
                        placeholder="Password..."
                        className="w-full px-4 py-2 bg-black text-white rounded-lg focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-5 py-2 mt-6 font-semibold text-black bg-white rounded-3xl shadow-md hover:bg-neutral-300 transition duration-300"
                >
                    Submit
                </button>
                <div className="flex gap-3 hover:cursor-pointer">
                    <Globe/>
                    <p>Login with google</p>

                </div>
            </form>
        </div>
    );
}
