'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'; 
import Header from './_components/Header';
import { GetAuthUserData } from '@/services/GlobalApi';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';


function Provider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const convex= useConvex()
    const router=useRouter()
    const {user,setUser}=useContext(AuthContext)
    useEffect(()=>{
      CheckUserAuth();
    },[])
    const CheckUserAuth =async ()=>{
      const token= localStorage.getItem('user_token')
      //Get new Access Token
      const user =token && await GetAuthUserData(token);
      if(!user?.email){
        router.replace('/sign-in')
        return
      }
      //get user from db
      try{
        const result = await convex.query(api.users.GetUser, { 
          email:user?.email
         });
         console.log(result);
         setUser(result);
      }catch (e){
        console.error("Failed to fetch user from Convex:", e);
      }
    }
  return (
    <div>
      <Header /> 
        {children}
    </div>
  )
}

export default Provider
