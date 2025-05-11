"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleLaunch = () => {
    router.push("/sign-in");
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex flex-col items-center justify-center px-6 py-12 overflow-hidden relative">

      {/* 🌌 Background logo */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-5">
        <Image
          src="/projectLogo.jpeg"
          alt="Jarvista Background Logo"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ✨ Cursor glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-10"
        style={{
          transform: `translate(${cursorPos.x - 100}px, ${cursorPos.y - 100}px)`,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-[200px] h-[200px] bg-white opacity-10 blur-3xl rounded-full"></div>
      </motion.div>

      {/* Central content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-20"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Jarvista
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-zinc-300 max-w-xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your AI-powered unified Assistant Hub<br /><br />Infinite Intelligence, One Platform
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleLaunch}
            className="bg-white text-black hover:bg-zinc-300 px-6 py-3 text-lg rounded-xl shadow-lg transition-all"
          >
            Launch Jarvista
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-20 text-sm text-zinc-500 text-center z-20">
        © 2025 Jarvista · The power of many, in ONE.
      </footer>
    </main>
  );
}