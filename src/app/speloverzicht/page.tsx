import Image from 'next/image';
import ludo from '../../img/ludo.jpg';
import checkers from '../../img/checkers.jpg';
import memory from '../../img/memory.jpg';
import dominoes from '../../img/dominoes.jpg';

export default function SpelOverzicht() {
	return (
		<>
			<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center">
				<div className="flex flex-col mt-36">
					<div className="text-center">
						<h1 className="text-5xl font-bold font-bambino text-white mb-4">
							Welkom "naam" bij Digimaatjes, Kies een spel en
							start!
						</h1>
					</div>

					<div className="grid grid-cols-2 gap-8">
						<a href="ludo" className="relative group">
							<Image
								src={ludo}
								alt="Game 1"
								className="w-full h-64 object-cover rounded-lg"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Mens erger je niet
							</div>
						</a>

						<a href="#game2" className="relative group">
							<Image
								src={checkers}
								alt="Game 2"
								className="w-full h-64 object-cover rounded-lg"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Binnenkort beschikbaar
							</div>
						</a>

						<a href="#game3" className="relative group">
							<Image
								src={memory}
								alt="Game 3"
								className="w-full h-64 object-cover rounded-lg"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Binnenkort beschikbaar
							</div>
						</a>

						<a href="#game4" className="relative group">
							<Image
								src={dominoes}
								alt="Game 3"
								className="w-full h-64 object-cover rounded-lg"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Binnenkort beschikbaar
							</div>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
