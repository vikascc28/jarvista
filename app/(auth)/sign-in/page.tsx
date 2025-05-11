'use client';

import { Button } from '@/components/ui/button';
import { GetAuthUserData } from '@/services/GlobalApi';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function SignIn() {
  const CreateUser = useMutation(api.users.CreateUser);
  const { use, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (typeof window !== undefined) {
        localStorage.setItem('user_token', tokenResponse.access_token);
      }
      const user = await GetAuthUserData(tokenResponse.access_token);
      const result = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
      });
      setUser(result);
      router.replace('/ai-assistants');
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center relative overflow-hidden">

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

      {/* Background logo (faded and blurred) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/projectLogo.jpeg"
          alt="Background Logo"
          className="w-full h-full object-cover opacity-5 blur-sm pointer-events-none select-none"
        />
      </div>

      {/* Sign-in box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-20 border border-zinc-700 bg-zinc-900/60 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center gap-6"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Sign in to Jarvista
        </h2>
        <p className="text-sm text-zinc-400 text-center">
        Get Ready to  Enter the Infinite Intelligence Horizon.
        </p>
        <Button
          onClick={() => googleLogin()}
          className="bg-white text-black hover:bg-zinc-300 w-full rounded-xl py-2 text-lg font-medium transition"
        >
          Sign in with Google
        </Button>
      </motion.div>
    </main>
  );
}

export default SignIn;