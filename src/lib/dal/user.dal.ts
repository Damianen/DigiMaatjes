'use server';
import 'server-only';

import { cache } from 'react';
import { User } from '@/lib/models/user.interface';
import { verifySession } from './dal';

const baseUrl = process.env.BASE_URL;

export const getCurrentUser = cache(async (): Promise<User | undefined> => {
    const session = await verifySession();
    if (!session) return undefined;

    return getUser(String(session.userName));
});

export const getUserName = cache(async () => {
    const session = await verifySession();
    if (!session) return null;

    return session.userName;
});

export const getUser = async (userName: string): Promise<User | undefined> => {
    const session = await verifySession();
    if (!session) return undefined;

    try {
        const apiResponse = await fetch(
            baseUrl + '/api/user/' + userName,
            {
                method: 'GET',
            }
        );

        const user: User = await apiResponse.json();
        if (user) {
            user.birthdate = new Date(user.birthdate);
            return user;
        } else {
            console.log('User not found!');
            return undefined;
        }
    } catch (error) {
        console.log('Failed to fetch user');
        console.log(error);
        return undefined;
    }
};