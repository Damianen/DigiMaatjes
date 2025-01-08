'use server';
import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { User } from '@/lib/models/user.interface';

const baseUrl = process.env.BASE_URL;

export const verifySession = cache(async () => {
	const cookie = (await cookies()).get('session')?.value;
	const session = await decrypt(cookie);

	if (!session?.userName) {
		redirect('/login');
	}

	return { isAuth: true, userName: session.userName };
});