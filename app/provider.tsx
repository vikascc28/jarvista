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
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const logout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({ user, setUser, logout }),
    [user],
  );

  return (
    <div>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ConvexProvider client={convex}>
            <AuthContext.Provider value={contextValue}>
              {children}
            </AuthContext.Provider>
            
          </ConvexProvider>
        </GoogleOAuthProvider>
   
    </div>
  )
}

export default Provider
