'use server';
import 'server-only';

import { cache } from 'react';
import { User } from '@/lib/models/user.interface';
import { verifySession, getToken } from './dal';
import { database } from '../dal/dao/db-config';
import * as sql from 'mssql';

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

export const getUser = async (
	userName: string,
	tokenFromApi?: string
): Promise<User | undefined> => {
	const session =
		(await verifySession(tokenFromApi)) || (await verifySession());
	if (!session) return undefined;

	try {
		if (!database.connected) {
			await database.connect();
		}

		const sqlRequest: sql.Request = database.request();

		sqlRequest.input('userName', sql.NVarChar, userName);

		const results = await sqlRequest.query(
			'select * from [User] WHERE userName = @userName'
		);

		await database.close();

		let user: User = results.recordset[0]
			? results.recordset[0]
			: undefined;

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
