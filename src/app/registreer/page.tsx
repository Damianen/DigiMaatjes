'use client';
import { signup } from '@/app/services/auth';
import { useState, useActionState } from 'react';

export default function Register() {
	const [showExplanation, setShowExplanation] = useState(false);

	const [state, action] = useActionState(signup, undefined);

	const toggleExplanation = () => {
		setShowExplanation(!showExplanation);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center justify-center px-4">
			<div className="text-center mb-2 relative">
				<div className="flex items-center justify-center mb-2 mt-4">
					<h1 className="text-4xl font-bold font-bambino text-white">
						Registeren
					</h1>
					<button
						onClick={toggleExplanation}
						className="ml-4 text-white bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						?
					</button>
				</div>

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
								Gebruikersnaam
							</label>
							<input
								type="text"
								id="username"
								name="username"
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
								E-mail
							</label>
							<input
								type="email"
								id="email"
								name="email"
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
								Voornaam
							</label>
							<input
								type="text"
								id="firstname"
								name="firstname"
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
								Achternaam
							</label>
							<input
								type="text"
								id="lastname"
								name="lastname"
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
								Geboortedatum
							</label>
							<input
								type="date"
								id="dob"
								name="dob"
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								required
							/>
						</div>

						<div className="w-full">
							<label
								htmlFor="password"
								className="block text-xl font-semibold text-white mb-2"
							>
								Wachtwoord
							</label>
							<input
								type="password"
								id="password"
								name="password"
								className="w-full px-4 py-4 text-xl border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
								placeholder="Kies een wachtwoord"
								required
							/>
							{state?.errors?.password && (
								<div>
									<p>Wachtwoord moet:</p>
									<ul>
										{state.errors.password.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>

					<div>
						{state?.message && <p>{state.message}</p>}
						{state?.error && <p>{state.error}</p>}
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
