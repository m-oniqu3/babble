"use client";

import Image from "next/image";
import { useState } from "react";
import { login, signup } from "./action";

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  return (
    <div className="flex justify-center items-center absolute -z-10 inset-0 bg-gray-100">
      <form className="wrapper space-y-6  max-w-xs">
        <header>
          <h1 className="text-xl font-bold pb-1">
            {isLoggingIn ? "Log in" : "Sign up"}
          </h1>
          <p className="text-sm font-light">
            {isLoggingIn
              ? "Access your shelves, track reading, and discover new books. Log in to get started."
              : "Create an account to build shelves, track your reading, and explore new books."}
          </p>
        </header>

        <div className="space-y-4 pb-6">
          <input
            className="bg-transparent border-b-[1px] font-light border-[#777] text-sm w-full placeholder:text-gray-500 placeholder:text-sm py-2 focus:outline-none"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <input
            className="bg-transparent border-b-[1px] font-light border-[#777] text-sm w-full placeholder:text-gray-500 placeholder:text-sm py-2 focus:outline-none"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <div>
          <button
            className="text-sm px-4 h-8 font-medium bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed w-full"
            formAction={isLoggingIn ? login : signup}
          >
            {isLoggingIn ? "Log in" : "Sign up"}
          </button>

          <p className="text-sm text-center mt-2">
            {isLoggingIn
              ? "Don't have an account?"
              : "Already have an account?"}
            &nbsp;
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() => setIsLoggingIn((state) => !state)}
            >
              {isLoggingIn ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </form>

      <figure className="hidden md:block w-1/2 h-full">
        <Image
          // src="https://images.pexels.com/photos/2908773/pexels-photo-2908773.jpeg?cs=tinysrgb&w=1260&h=750&dpr=2"
          src="https://images.pexels.com/photos/256453/pexels-photo-256453.jpeg?cs=largesrgb&w=1260&h=750&dpr=2"
          alt="shleves of books in black and white"
          className="h-full w-full object-cover"
          width="1260"
          height="750"
        />
      </figure>
    </div>
  );
}
