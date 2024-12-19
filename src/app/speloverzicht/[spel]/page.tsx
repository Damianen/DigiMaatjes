'use client';
import Image from 'next/image';
import accountIcon from '../../../../public/img/accounticon.png';
import { useParams } from 'next/navigation';

export default function GameRoom() {
	const spel = useParams().spel?.toString();
	const spelnaam = spel ? spel : 'Mens erger je niet';
	const spelimg = `/img/${spelnaam}.jpg`;
	var gameRealName = spelnaam;
	if (spelnaam == 'Mensergerjeniet') {
		gameRealName = 'Mens erger je niet';
	}

	const username = 'Digimaatje';

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center px-4">
			<header className="w-full max-w-6xl flex justify-between items-center py-4">
				<div className="text-white text-2xl font-bold"></div>
				<div className="flex items-center space-x-4">
					<button className="text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
						?
					</button>
					<div className="w-8 h-8 rounded-full flex items-center justify-center">
						<Image src={accountIcon} alt="Account icon" />
					</div>
				</div>
			</header>

			<main className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
				<div className="flex items-center justify-between mb-6">
					<div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
						<Image
							src={spelimg}
							alt="Spel afbeelding"
							width={100}
							height={100}
							className="object-cover w-full h-full"
							priority
						/>
					</div>

					<div className="flex-1 mx-4 text-lg font-semibold">
						{gameRealName} is een spel voor 2 tot 4 spelers.
					</div>

					<div>
						<button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
							Creëer zelf spel
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4">
					<div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg shadow">
						<div className="text-lg font-semibold">
							{username}'s kamer
						</div>
						<div className="text-lg">User 1/4</div>
						<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
							Join
						</button>
					</div>

					<div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg shadow">
						<div className="text-lg font-semibold">
							{username}'s kamer
						</div>
						<div className="text-lg">User 3/4</div>
						<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
							Join
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
