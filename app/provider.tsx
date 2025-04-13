import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'

function Provider(
    {
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>
) {
  return (
    <div>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {children}
        </GoogleOAuthProvider>
   
    </div>
  )
}

export default Provider
