'use client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import React, { useState } from 'react'
import { AuthContext } from '@/context/AuthContext';



function Provider(
    {
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>
) {

  const [user,setUser]=useState();
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return (
    <div>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ConvexProvider client={convex}>
            <AuthContext.Provider value ={{user,setUser}}>
              {children}
            </AuthContext.Provider>
            
          </ConvexProvider>
        </GoogleOAuthProvider>
   
    </div>
  )
}

export default Provider
