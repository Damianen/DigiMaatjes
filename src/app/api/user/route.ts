import { headers } from 'next/headers';

export async function GET(request: Request) {
	const headersList = await headers();
	const data = {
		hello: 'Hello world!',
	};
	return Response.json(data, {
		status: 200,
	});
}
