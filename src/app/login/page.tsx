'use client';

import { useState } from 'react';

export default function Login() {
	const [showExplanation, setShowExplanation] = useState(false);

	const toggleExplanation = () => {
		setShowExplanation(!showExplanation);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center justify-center px-4">
			<div className="text-center mb-2 relative">
				<div className="flex items-center justify-center mb-2 mt-4">
					<h1 className="text-4xl font-bold font-bambino text-white">
						Inloggen
					</h1>
					<button
						onClick={toggleExplanation}
						className="ml-4 text-white bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						?
					</button>
				</div>

				{showExplanation && (
					<div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white text-blue-700 text-sm rounded-lg shadow-lg p-4 w-64 z-10">
						<p>
							We vragen je om een account te maken zodat je kunt
							chatten met je vrienden en samen een spel kunt
							spelen. Inloggen is nodig om je voortgang op te
							slaan en je te koppelen aan je vrienden.
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
				<form>
					<div className="grid grid-cols-1 gap-8 mb-8">
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
								placeholder="Voer je wachtwoord in"
								required
							/>
						</div>
					</div>

					<div className="text-center mt-12">
						<button
							type="submit"
							className="w-full px-12 py-6 text-2xl bg-blue-600 text-white rounded-lg font-semibold font-bambino hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600"
						>
							Inloggen
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
