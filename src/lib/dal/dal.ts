'use server';
import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const baseUrl = process.env.BASE_URL;

export const verifySession = cache(async () => {
	const token = await getToken()
	const session = await decrypt(token);

	if (!session) {
		redirect('/login');
	}

	return { isAuth: true, userName: session.userName };
});

export const verifySessionApi = cache(async (token: string) => {
	const session = await decrypt(token);

	if (!session) {
		return undefined;
	}

	return { isAuth: true, userName: session.userName };
});

export const getToken = cache(async () => {
	return (await cookies()).get('session')?.value;
});