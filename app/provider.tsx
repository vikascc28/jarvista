'use client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useMemo, useState } from 'react'
import { AuthContext, AuthUser } from '@/context/AuthContext';



function Provider(
    {
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>
) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'http://127.0.0.1:3210';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  const logout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({ user, setUser, logout }),
    [user],
  );

  const appContent = (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );

  return (
    <div>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ConvexProvider client={convex}>{appContent}</ConvexProvider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default Provider
