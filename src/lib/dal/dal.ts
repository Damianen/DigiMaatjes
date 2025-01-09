'use server';
import 'server-only';

import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';



export const verifySession = cache(async () => {
	const cookie = (await cookies()).get('session')?.value;
	const session = await decrypt(cookie);

	if (!session?.userName) {
		redirect('/login');
	}

	return { isAuth: true, userName: session.userName };
});