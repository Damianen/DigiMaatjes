'use client';
import { signup } from '@/app/services/auth';
import Link from 'next/link';
import { useState, useActionState } from 'react';

export default function Register() {
	const [showExplanation, setShowExplanation] = useState(false);

	// State to hold form input values
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		firstname: '',
		lastname: '',
		dob: '',
		password: '',
	});

	const [state, action] = useActionState(signup, undefined);

	const toggleExplanation = () => {
		setShowExplanation(!showExplanation);
	};

	// Handle input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center justify-center px-4">
			<div className="text-center mb-2 relative">
				<div className="flex items-center justify-center mb-2 mt-4">
					<h1 className="text-4xl font-bold font-bambino text-white">
						Registreren
					</h1>
					<button
						onClick={toggleExplanation}
						className="ml-4 text-white bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						?
					</button>
				</div>

				<p className="text-lg font-bold font-bambino text-white">
					Alle velden met een * is verplicht in te vullen
				</p>

				{showExplanation && (
					<div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white text-blue-700 text-sm rounded-lg shadow-lg p-6 w-80 z-10">
						<p>
							We vragen je om een account te maken zodat je kunt
							chatten met je vrienden en samen een spel kunt
							spelen. Registreren is nodig om je voortgang op te
							slaan en je te koppelen aan je vrienden en een chat
							met hun te starten.
						</p>
						<button
							onClick={toggleExplanation}
							className="mt-2 text-blue-600 hover:text-blue-800 underline"
						>
							Sluiten
						</button>
					</div>
				)}
			</div>

			<div className="w-full max-w-4xl rounded-lg p-8">
				<form action={action}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
						<div className="w-full">
							<label
								htmlFor="username"
								className="block text-xl font-semibold text-white mb-2"
							>
								Gebruikersnaam*
							</label>
							<input
								type="text"
								id="username"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								placeholder="Voer je gebruikersnaam in"
								required
							/>
						</div>

						<div className="w-full">
							<label
								htmlFor="email"
								className="block text-xl font-semibold text-white mb-2"
							>
								E-mail*
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								placeholder="Voer je e-mail in"
								required
							/>
						</div>
						{state?.errors?.email && <p>{state.errors.email}</p>}

						<div className="w-full">
							<label
								htmlFor="firstname"
								className="block text-xl font-semibold text-white mb-2"
							>
								Voornaam*
							</label>
							<input
								type="text"
								id="firstname"
								name="firstname"
								value={formData.firstname}
								onChange={handleInputChange}
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								placeholder="Voer je voornaam in"
								required
							/>
						</div>

						<div className="w-full">
							<label
								htmlFor="lastname"
								className="block text-xl font-semibold text-white mb-2"
							>
								Achternaam*
							</label>
							<input
								type="text"
								id="lastname"
								name="lastname"
								value={formData.lastname}
								onChange={handleInputChange}
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								placeholder="Voer je achternaam in"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
						<div className="w-full">
							<label
								htmlFor="dob"
								className="block text-xl font-semibold text-white mb-2"
							>
								Geboortedatum*
							</label>
							<input
								type="date"
								id="dob"
								name="dob"
								value={formData.dob}
								onChange={handleInputChange}
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								required
							/>
						</div>

						<div className="w-full">
							<label
								htmlFor="password"
								className="block text-xl font-semibold text-white mb-2"
							>
								Wachtwoord*
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								placeholder="Kies een wachtwoord"
								required
							/>
							{state?.errors?.password && (
								<div>
									<p className="text-lg">Wachtwoord moet:</p>
									<ul>
										{state.errors.password.map((error) => (
											<li className="text-lg" key={error}>
												- {error}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>

					<div className="text-center">
						{state?.message && (
							<div
								role="alert"
								className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-200"
							>
								<p className="Info alert! text-lg">
									{state.message}
								</p>
							</div>
						)}
						{state?.message && (
							<div className="mb-4">
								<Link href="/login">
									<button className="w-full px-12 py-6 text-2xl bg-blue-600 text-white rounded-lg font-semibold font-bambino hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600">
										Klik hier om in te loggen!{''}
									</button>
								</Link>
							</div>
						)}
						{state?.error && (
							<div
								role="alert"
								className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100"
							>
								<p className="Danger alert! text-lg">
									<span className="font-bold">Fout:</span>{' '}
									{state.error}
								</p>
							</div>
						)}
					</div>

					<div className="text-center">
						<button
							type="submit"
							className="w-full px-12 py-6 text-2xl bg-blue-600 text-white rounded-lg font-semibold font-bambino hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600"
						>
							Registreer
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
