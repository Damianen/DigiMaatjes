import { database } from '../../dao/db-config';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import * as sql from 'mssql';

export async function POST(request: Request) {
	try {
		const data = await request.json();

		if (!data.email) {
			return Response.json(
				{ error: "field 'email' cannot be empty!" },
				{ status: 400 }
			);
		}
		if (!data.userName) {
			return Response.json(
				{ error: "field 'userName' cannot be empty!" },
				{ status: 400 }
			);
		}
		if (!data.firstName) {
			return Response.json(
				{ error: "field 'firstName' cannot be empty!" },
				{ status: 400 }
			);
		}
		if (!data.lastName) {
			return Response.json(
				{ error: "field 'lastName' cannot be empty!" },
				{ status: 400 }
			);
		}
		if (data.birthDate) {
			const regex = new RegExp(
				"^(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])-(19|20)\\d{2}$"
			);

			if (!regex.test(data.birthDate)) {
				return Response.json(
					{
						error: "field 'birthDate' must be a valid date in format MM-dd-yyyy!",
					},
					{ status: 400 }
				);
			}
		} else {
			return Response.json(
				{ error: "field 'birthDate' cannot be empty!" },
				{ status: 400 }
			);
		}
		if (!data.password) {
			return Response.json(
				{ error: "field 'password' cannot be empty!" },
				{ status: 400 }
			);
		}

		const salt = genSaltSync(10);
		const hash = hashSync(data.password, salt);
				
		const normalizedDateStr = data.birthDate.replace(/[\./]/g, '-');
		const newDate = new Date(normalizedDateStr);
		newDate.setHours(newDate.getHours() + 1); //offset timezone GMT+1
		const formatedDate = newDate.toISOString();

		if (!database.connected) {
			await database.connect();
		}

		const checkEmail: sql.Request = database.request();
		checkEmail.input('email', sql.NVarChar, data.email);
		const emailCheck = await checkEmail.query(
			'SELECT email FROM [User] WHERE email=@email'
		);
		if (emailCheck.recordset.length > 0) {
			await database.close();
			return Response.json(
				{ error: 'Email staat al geregistreerd!' },
				{ status: 409 }
			);
		}

		const checkUserName: sql.Request = database.request();
		checkUserName.input('userName', sql.NVarChar, data.userName);
		const userNameCheck = await checkUserName.query(
			'SELECT email FROM [User] WHERE userName=@userName'
		);
		if (userNameCheck.recordset.length > 0) {
			await database.close();
			return Response.json(
				{ error: 'Gebruikersnaam is al in gebruik!' },
				{ status: 409 }
			);
		}

		const sqlRequest: sql.Request = database.request();
		sqlRequest.input('email', sql.NVarChar, data.email);
		sqlRequest.input('userName', sql.NVarChar, data.userName);
		sqlRequest.input('firstName', sql.NVarChar, data.firstName);
		sqlRequest.input('lastName', sql.NVarChar, data.lastName);
		sqlRequest.input('password', sql.NVarChar, hash);
		sqlRequest.input('birthDate', sql.Date, formatedDate);

		const results = await sqlRequest.query(
			`INSERT INTO [User]([email],[userName],[firstName],[lastName],[password],[birthDate])
			VALUES(@email ,@userName,@firstName,@lastName,@password, @birthDate)`
		);
		await database.close();

		return Response.json({ succes: true }, { status: 200 });
	} catch (err: any) {
		return Response.json(
			{ error: err.message || 'An unexpected error occurred' },
			{ status: 400 }
		);
	}
}
