export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center justify-center">
			<div className="text-center">
				<h1 className="text-5xl font-bold font-bambino text-white mb-4">
					Welkom bij Digimaatjes
				</h1>
				<p className="text-lg font-bambino text-blue-100 mb-8">
					Speel samen met je vrienden of maak nieuwe vrienden in de
					online wereld van Digimaatje.
				</p>
			</div>

			<div className="flex gap-12 w-full max-w-[750px]">
				<a
					href="login"
					className="flex-1 px-12 py-6 text-2xl bg-white text-blue-600 rounded-lg font-semibold font-bambino hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-600 text-center"
				>
					Login
				</a>
				<a
					href="registeer"
					className="flex-1 px-12 py-6 text-2xl bg-white text-blue-600 rounded-lg font-semibold font-bambino hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-600 text-center"
				>
					Registreer
				</a>
			</div>

			<div className="flex justify-center w-full max-w-[750px] mt-8">
				<a
					href="speloverzicht"
					className="px-12 py-6 text-2xl bg-white text-blue-600 rounded-lg font-semibold font-bambino hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-600 text-center"
				>
					Spel Overzicht
				</a>
			</div>
		</div>
	);
}
