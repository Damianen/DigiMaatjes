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
	const user = {
		email: formData.get('email'),
		password: formData.get('password'),
		userName: formData.get('username'),
		firstName: formData.get('firstname'),
		lastName: formData.get('lastname'),
		birthDate: formatedDate,
	};

	const apiResponse = await fetch(baseUrl + '/api/user/register', {
		method: 'POST',
		body: JSON.stringify(user),
	});
	const data = await apiResponse.json();
	if (data.succes) {
		return {
			message: 'User is succesvol aangemaakt!',
		};
	} else {
		return {
			apiError: data.error,
		};
	}
}

export async function signin(state: LoginFormState, formData: FormData) {
	const login = {
		password: formData.get('password'),
		userName: formData.get('username'),
	};

	const apiResponse = await fetch(baseUrl + '/api/user/login', {
		method: 'POST',
		body: JSON.stringify(login),
	});
	const data = await apiResponse.json();
	if (data.succes) {
		await createSession(String(login.userName));
		redirect('/speloverzicht');
	} else {
		return {
			apiError: data.error,
		};
	}
}

export async function logout() {
	deleteSession();
	redirect('/login');
}
