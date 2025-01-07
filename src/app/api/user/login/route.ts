import { database } from '../../dao/db-config';
import { compareSync } from 'bcrypt-ts';
import * as sql from 'mssql';

export async function POST(request: Request) {
	try {
		const data = await request.json();

		if (!data.userName) {
			return Response.json(
				{ error: "field 'userName' cannot be empty!" },
				{ status: 400 }
			);
		}
		if (!data.password) {
			return Response.json(
				{ error: "field 'password' cannot be empty!" },
				{ status: 400 }
			);
		}

		if (!database.connected) {
			await database.connect();
		}

		const sqlRequest: sql.Request = database.request();

		sqlRequest.input('userName', sql.NVarChar, data.userName);

		const results = await sqlRequest.query(
			'SELECT userName, password FROM [User] WHERE userName=@userName'
		);

		await database.close();

		if (results.recordset.length == 0) {
			return Response.json(
				{ error: 'Gebruiker niet gevonden!' },
				{ status: 404 }
			);
		} else if (!compareSync(data.password, results.recordset[0].password)) {
			return Response.json(
				{ error: 'Wachtwoord is incorrect!' },
				{ status: 404 }
			);
		}

		return Response.json({ succes: true }, { status: 200 });
	} catch (err: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return Response.json(
            { error: errorMessage },
            { status: 400 }
        );
    }
}
