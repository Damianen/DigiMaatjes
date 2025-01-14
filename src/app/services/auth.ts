'use server';
import 'server-only';
import {
	SignupFormSchema,
	RegisterFormState,
	LoginFormState,
} from '@/lib/models/authForm.definitions';
import 'dotenv/config';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { login, register } from '@/lib/dal/auth.dal';
import { User } from '@/lib/models/user.interface';

const baseUrl = process.env.BASE_URL;

export async function signup(state: RegisterFormState, formData: FormData) {
	// Validate form fields
	const validatedFields = SignupFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const formatedDate =
		String(formData.get('dob'))?.split('-')[1] +
		'-' +
		String(formData.get('dob'))?.split('-')[2] +
		'-' +
		String(formData.get('dob'))?.split('-')[0];

	const user: User = {
		email: String(formData.get('email')),
		password: String(formData.get('password')),
		userName: String(formData.get('username')),
		firstName: String(formData.get('firstname')),
		lastName: String(formData.get('lastname')),
		birthdate: new Date(formatedDate),
	};

	const data = await register(user);
	if (data.succes) {
		return {
			message: 'User is succesvol aangemaakt!',
		};
	} else {
		return {
			error: data.error,
		};
	}
}

export async function signin(state: LoginFormState, formData: FormData) {
	const loginData = {
		password: formData.get('password'),
		userName: formData.get('username'),
	};

	const loginCall = await login(
		String(loginData.userName),
		String(loginData.password)
	);
	if (loginCall.succes) {
		await createSession(String(loginData.userName));
		redirect('/speloverzicht');
	} else {
		return {
			error: loginCall.error,
		};
	}
}

export async function logout() {
	deleteSession();
	redirect('/login');
}
