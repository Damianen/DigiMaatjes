'use server';
import 'server-only' 

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { User } from '@/app/lib/definitions';

const baseUrl = process.env.BASE_URL;
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userName) {
    redirect('/login')
  }
 
  return { isAuth: true, userName: session.userName }
})

export const getUser = cache(async (): Promise<User | undefined> => {
    const session = await verifySession()
    if (!session) return undefined;
   
    try {
    const apiResponse = await fetch(baseUrl + '/api/user/' + session.userName, {
        method: 'GET',
    });
   
    const user = await apiResponse.json();
    if(user){
        console.log(user)
        return user;
    }else{
        console.log("User not found!")
        return undefined;
    }

    } catch (error) {
      console.log('Failed to fetch user')
      console.log(error)
      return undefined;
    }
})

export const getUserName = cache(async () => {
    const session = await verifySession()
    if (!session) return null
   
    return session.userName;
})