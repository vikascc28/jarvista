'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'; 
import Header from './_components/Header';
import { GetSessionUserData } from '@/services/GlobalApi';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { AssistantContext, AssistantType } from '@/context/AssistantContext';


function Provider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const convex= useConvex()
    const router=useRouter()
    const { setUser }=useContext(AuthContext)
    const[assistant,setAssistant]=useState<AssistantType | null>(null);
    useEffect(()=>{
      void CheckUserAuth();
    },[])
    const CheckUserAuth =async ()=>{
      const oauthUser = await GetSessionUserData();
      if(!oauthUser?.email){
        router.replace('/sign-in')
        return
      }
      //get user from db
      try{
        const result = await convex.query(api.users.GetUser, { 
          email:oauthUser?.email
         });
         if (!result) {
          router.replace('/sign-in');
          return;
         }
         setUser(result);
      }catch {
        router.replace('/sign-in');
      }
    }
  return (
    <div>
      <AssistantContext.Provider value={{assistant,setAssistant}}>
        <Header /> 
        {children}
        </AssistantContext.Provider> 
    </div>
  )
}

export default Provider
