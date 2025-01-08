import { JWTPayload } from 'jose';
import { z } from 'zod';

export interface SessionPayload extends JWTPayload {
	userName: string;
	expiresAt: Date;
}

export type RegisterFormState =
	| {
			errors?: {
				email?: string[];
				password?: string[];
				api?: string[];
			};
			message?: string;
			apiError?: string;
	  }
	| undefined;

export const SignupFormSchema = z.object({
	email: z.string().email({ message: 'Voer een geldige email in!' }).trim(),
	password: z
		.string()
		.min(8, { message: 'tenminste 8 tekens lang zijn!' })
		.regex(/[a-zA-Z]/, { message: 'tenminste 1 letter bevatten' })
		.regex(/[0-9]/, { message: 'tenminste 1 nummer bevatten' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'tenminste 1 speciaal teken bevatten',
		})
		.trim(),
});

export type LoginFormState =
	| {
			message?: string;
			apiError?: string;
	  }
	| undefined;

export interface UserCredentials {
	userName: string;
	password: string;
}

export interface User extends UserCredentials {
	email: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	profilePicture?: string;
}