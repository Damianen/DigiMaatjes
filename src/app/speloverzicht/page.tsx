'use client';

import Image from 'next/image';
import ludo from '../../../public/img/mensergerjeniet.jpg';
import checkers from '../../../public/img/dammen.jpg';
import memory from '../../../public/img/memory.jpg';
import dominoes from '../../../public/img/dominoes.jpg';
import Navbar from '../component/navbar';
import { useEffect, useState } from 'react';
import Loading from '../component/loading';
import Link from 'next/link';

import { getUser } from '../lib/dal';
import { User } from '../lib/definitions';

export default function SpelOverzicht() {
	// const username = 'Digimaatjes';

	const [user, setUser] = useState<User | undefined>(undefined);

	useEffect(() => {
		(async () => {
			try {
				const user = await getUser();
				if (user) {
					setUser(user);
					console.log(user);
				}
				console.log(user);
			} catch (err) {
				console.log('Error occured when fetching User');
			}
		})();
	}, []);


	const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
		'pending'
	);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchUsername() {
			setStatus('pending');
			try {
				setTimeout(() => {
					setStatus('success');
				}, 10);
			} catch (e) {
				console.log(e);
				setStatus('error');
				setError(e as Error);
			}
		}
		fetchUsername();
	}, []);

	if (status === 'pending') {
		return <Loading />;
	}
	if (status === 'error') return <h1>Error! {error?.message}</h1>;

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center">
				<div className="flex flex-col mt-8">
					<div className="text-center">
						<h1 className="text-5xl font-bold font-bambino text-white mb-4">
							Welkom bij <Link href="/">Digimaatjes</Link>, Kies een
							spel en start!
						</h1>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<Link
							href="speloverzicht/Mensergerjeniet"
							className="relative group"
						>
							<div className="w-full h-64 overflow-hidden rounded-lg">
								<Image
									src={ludo}
									alt="afbeelding mens erger je niet"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Mens erger je niet
							</div>
						</Link>

						<Link
							href="speloverzicht/Dammen"
							className="relative group"
						>
							<div className="w-full h-64 overflow-hidden rounded-lg">
								<Image
									src={checkers}
									alt="afbeelding dammen"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Binnenkort beschikbaar
							</div>
						</Link>

						<Link
							href="speloverzicht/Memory"
							className="relative group"
						>
							<div className="w-full h-64 overflow-hidden rounded-lg">
								<Image
									src={memory}
									alt="afbeelding memory spel"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Binnenkort beschikbaar
							</div>
						</Link>

						<Link
							href="speloverzicht/Dominoes"
							className="relative group"
						>
							<div className="w-full h-64 overflow-hidden rounded-lg">
								<Image
									src={dominoes}
									alt="afbeelding dominoes spel"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bambino text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
								Binnenkort beschikbaar
							</div>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
