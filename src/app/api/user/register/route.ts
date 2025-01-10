import { register } from '@/lib/dal/auth.dal';
import { User } from '@/lib/models/user.interface';

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
				'^(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])-(19|20)\\d{2}$'
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

		const normalizedDateStr = data.birthDate.replace(/[\./]/g, '-');
		const formatedDate = new Date(normalizedDateStr);

		const user: User = {
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			userName: data.userName,
			password: data.password,
			birthdate: formatedDate,
		};

		const result = await register(user);

		if (result.succes) {
			return Response.json({ succes: true }, { status: 200 });
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
