import { headers } from 'next/headers';
import { database } from '../dao/db-config';

export async function GET(request: Request) {
	const headersList = await headers();
	if (!database.connected) {
		await database.connect();
	}
	const results = await database.request().query("select * from [User]");
	await database.close();
	
	return Response.json(results.recordset, {
		status: 200,
	});
}
