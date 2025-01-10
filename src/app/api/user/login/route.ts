import { login } from '@/lib/dal/auth.dal';
import { createSession } from '@/lib/session';

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

		const result = await login(data.userName, data.password);

		if (result.succes) {
			const token = await createSession(data.userName);
			return Response.json(
				{ succes: true, token: token },
				{ status: 200 }
			);
		} else {
			return Response.json({ error: result.error }, { status: 400 });
		}
	} catch (err: unknown) {
		let errorMessage = 'An unexpected error occurred';
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		return Response.json({ error: errorMessage }, { status: 400 });
	}
}
