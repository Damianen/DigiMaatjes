'use server';
import 'server-only' 

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userName) {
    redirect('/login')
  }
 
  return { isAuth: true, userName: session.userName }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
   
    try {
    const apiResponse = await fetch('api/user', {
        method: 'GET',
    });
   
    const data = await apiResponse.json();
   
    return data;

    } catch (error) {
      console.log('Failed to fetch user')
      return null
    }
})

export const getUserName = cache(async () => {
    const session = await verifySession()
    if (!session) return null
   
    return session.userName;
})