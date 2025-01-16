'use server';
import 'server-only';

import { cache } from 'react';
import { IFriendship, UpdateUser, User } from '@/lib/models/user.interface';
import { verifySession } from './dal';
import { database } from '../dal/dao/db-config';
import * as sql from 'mssql';
import { createSession, deleteSession } from '../session';

export const getCurrentUser = cache(async (): Promise<User | undefined> => {
	const session = await verifySession();
	if (!session) return undefined;

	return getUser(String(session.userName));
});

export const getUserName = cache(async (): Promise<string | undefined> => {
	const session = await verifySession();
	if (!session) return undefined;

	return String(session.userName);
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
			'SELECT * FROM [User] WHERE userName = @userName'
		);

		await database.close();

		const user: User = results.recordset[0]
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

export const updateCurrentUser = async (
	updateData: UpdateUser
): Promise<true | undefined> => {
	const session = await verifySession();
	if (!session) return undefined;
	let relogin = false;
	const currentData = await getCurrentUser();

	try {
		if (!database.connected) {
			await database.connect();
		}

		const updateUserRequest: sql.Request = database.request();

		if (updateData.email) {
			//check if updated email already exists
			const emailCheckRequest: sql.Request = database.request();
			emailCheckRequest.input('email', sql.NVarChar, updateData.email);
			const emailCheckRequestResults = await emailCheckRequest.query(
				'SELECT email FROM [User] WHERE email = @email'
			);

			if (emailCheckRequestResults.recordset.length != 0) {
				if (
					emailCheckRequestResults.recordset[0].email !=
					currentData!.email
				) {
					await database.close();
					throw 'Email is al in gebruik!';
				}
			}

			updateUserRequest.input('email', sql.NVarChar, updateData.email);
		} else {
			updateUserRequest.input('email', sql.NVarChar, currentData!.email);
		}

		if (updateData.userName) {
			relogin = true;

			//check if updated username already exists
			const userNameCheckRequest: sql.Request = database.request();
			userNameCheckRequest.input(
				'userName',
				sql.NVarChar,
				updateData.userName
			);
			const userNameCheckRequestResults =
				await userNameCheckRequest.query(
					'SELECT userName FROM [User] WHERE userName = @userName'
				);

			if (userNameCheckRequestResults.recordset.length != 0) {
				if (
					userNameCheckRequestResults.recordset[0].userName !=
					currentData!.userName
				) {
					await database.close();
					throw 'Username is al in gebruik!';
				}
			}

			updateUserRequest.input(
				'userName',
				sql.NVarChar,
				updateData.userName
			);
		} else {
			updateUserRequest.input(
				'userName',
				sql.NVarChar,
				currentData!.userName
			);
		}

		if (updateData.firstName) {
			updateUserRequest.input(
				'firstName',
				sql.NVarChar,
				updateData.firstName
			);
		} else {
			updateUserRequest.input(
				'firstName',
				sql.NVarChar,
				currentData!.firstName
			);
		}

		if (updateData.lastName) {
			updateUserRequest.input(
				'lastName',
				sql.NVarChar,
				updateData.lastName
			);
		} else {
			updateUserRequest.input(
				'lastName',
				sql.NVarChar,
				currentData!.lastName
			);
		}

		if (updateData.birthdate) {
			updateData.birthdate.setHours(updateData.birthdate.getHours() + 1); //offset timezone GMT+1
			const formatedDate = updateData.birthdate.toISOString();
			updateUserRequest.input('birthdate', sql.Date, formatedDate);
		} else {
			currentData!.birthdate.setHours(
				currentData!.birthdate.getHours() + 1
			); //offset timezone GMT+1
			const formatedDate = currentData!.birthdate.toISOString();
			updateUserRequest.input('birthdate', sql.Date, formatedDate);
		}

		if (updateData.profileImages) {
			updateUserRequest.input(
				'profilePicture',
				sql.NVarChar,
				updateData.profileImages
			);
			
		} else {
			updateUserRequest.input(
				'profilePicture',
				sql.NVarChar,
				currentData!.profileImages
			);
		}

		updateUserRequest.input(
			'originalUserName',
			sql.VarChar,
			currentData!.userName
		);

		if (!database.connected) {
			await database.connect();
		}

		await updateUserRequest.query(
			`UPDATE [User] SET 
				[email] = @email,
			 	[userName] = @userName,
				[firstName] = @firstName,
				[lastName] = @lastName,
				[birthdate] = @birthdate,
				[profilePicture] = @profilePicture
			 WHERE [userName] = @originalUserName`
		);

		await database.close();
	} catch (error) {
		console.log('Failed to update user');
		console.log(error);
		throw error;
	}

	if (relogin) {
		await deleteSession();
		await createSession(String(updateData.userName));
	}

	return true;
};

export const getCurrentUserFriendships = cache(
	async (): Promise<IFriendship[] | undefined> => {
		const session = await verifySession();
		if (!session) return undefined;
		const userName = await getUserName();

		try {
			if (!database.connected) {
				await database.connect();
			}

			const sqlRequest: sql.Request = database.request();

			sqlRequest.input('userName', sql.NVarChar, userName);

			const results = await sqlRequest.query(
				'SELECT * FROM [FriendShip] WHERE FK_user1 = @userName OR FK_user2 = @userName'
			);

			await database.close();

			const friendships: IFriendship[] | undefined = results.recordset
				? results.recordset
				: undefined;

			return friendships;
		} catch (error) {
			console.log('Failed to fetch friendships');
			console.log(error);
			return undefined;
		}
	}
);
