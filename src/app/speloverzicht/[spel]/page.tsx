'use client';
import Image from 'next/image';
import { getUserName } from '@/lib/dal/user.dal';
import Navbar from '@/app/component/navbar';
import { useParams, useRouter } from 'next/navigation';
import { socket } from '../../socket';
import Joyride, { Placement } from 'react-joyride';
import { useState, useEffect } from 'react';
import Loading from '@/app/component/loading';

interface Room {
	roomName: string;
	numUsers: number;
}

export default function GameRoom() {
	const router = useRouter();
	const spel = useParams().spel?.toString();
	const spelnaam = spel ? spel : 'Mens erger je niet';
	const spelimg = `/img/${spelnaam}.jpg`;

	let gameRealName = spelnaam;
	if (spelnaam == 'Mensergerjeniet') {
		gameRealName = 'Mens erger je niet';
	}

	const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
		'pending'
	);
	const [error, setError] = useState<Error | null>(null);

	const [isTourActive, setIsTourActive] = useState(false);

	const [nickname, setNickname] = useState<string>('');
	const [rooms, setRooms] = useState<Room[]>([]);

	const id = rooms.length + 1;

	useEffect(() => {
		getUser();
		findRooms();
		socket.on('updateRooms', (rooms: Room[]) => {
			console.log(rooms);
			setRooms(rooms);
		});

		return () => {
			socket.off('updateRooms');
		};
	}, []);

	function findRooms() {
		socket.emit('findRooms', spelnaam);
		socket.on('updateRooms', (rooms: Room[]) => {
			console.log(rooms);
			setRooms(rooms);
		});
	}

	async function getUser() {
		const user = await getUserName();
		console.log(user);
		if (user) {
			setNickname(user as string);
		}
		console.log('nickname ' + nickname);
	}

	function handleCreateGame() {
		setStatus('pending');
		console.log('create game with username: ', nickname);
		socket.emit('createRoom', `${spelnaam}-${id}`, nickname, spelnaam);

		setTimeout(() => {
			router.push(`/room/${spelnaam}-${id}`);
		}, 250);
	}

	useEffect(() => {
		async function initialize() {
			try {
				setStatus('pending');
				await new Promise((resolve) => setTimeout(resolve, 250));
				setStatus('success');
			} catch (e) {
				setError(e as Error);
				setStatus('error');
			}
		}
		initialize();
	}, []);

	if (status === 'pending') {
		return <Loading />;
	}
	if (status === 'error') return <h1>Error! {error?.message}</h1>;

	const steps = [
		{
			target: '.main-field',
			content:
				'Op dit pagina kun je een spel kamer creëren of een kamer van een vriend toe treden.',
			placement: 'top' as Placement,
			disableBeacon: true,
		},
		{
			target: '.create-game-button',
			content: 'Klik hier om je eigen spelkamer te creëren!',
			placement: 'bottom' as Placement,
			shouldScroll: false,
			disableBeacon: true,
		},
		{
			target: '.lobby-name',
			content:
				'Hier zie je de naam van de kamer. de kamer heeft de naam van de gebruiker die de kamer beheerd',
			placement: 'bottom' as Placement,
			disableBeacon: true,
		},

		{
			target: '.max-user',
			content:
				'Hier zie je hoeveel spelers al in de kamer zijn, daarnaast zie je ook het maximum aantal spelers van een kamer.',
			placement: 'bottom' as Placement,
			disableBeacon: true,
		},
		{
			target: '.join-room-button',
			content: 'Klik hier om een kamer van een vriend toe te treden!',
			placement: 'bottom' as Placement,
			disableBeacon: true,
		},
	];

	const toggleExplanation = () => {
		setIsTourActive(false);
		setIsTourActive(true);
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center px-4">
				<main className="main-field w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 mt-10">
					<div className="flex items-center justify-between mb-6">
						<div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden sm:w-16 sm:h-16">
							<Image
								src={spelimg}
								alt="Spel afbeelding"
								width={100}
								height={100}
								className="object-cover w-full h-full"
								priority
							/>
						</div>

						<div className="flex-1 mx-4 text-lg font-semibold sm:text-base">
							{gameRealName} is een spel voor 2 tot 4 spelers.
						</div>

						<button
							onClick={() => router.push('/speloverzicht')}
							className="px-8 py-3 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mr-12 sm:px-4 sm:py-2 sm:text-base sm:mr-4"
						>
							Naar speloverzicht
						</button>

						<div className="flex items-center gap-x-6 relative sm:gap-x-2">
							<button
								onClick={handleCreateGame}
								className="create-game-button px-8 py-3 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-base"
							>
								Creëer spel kamer
							</button>

							<button
								onClick={toggleExplanation}
								className="text-white bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-8 sm:h-8 sm:text-xs"
							>
								?
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6">
						{rooms.map((room, index) => (
							<div
								key={index}
								className="flex items-center justify-between bg-blue-100 p-4 rounded-lg shadow"
							>
								<div className="flex-1 text-lg font-semibold font-bambino">
									<span className="lobby-name">
										{room.roomName}
									</span>
								</div>
								<div className="max-user text-lg flex-shrink-0 min-w-[80px] text-center mr-20">
									Users: {room.numUsers}/4
								</div>
								<button
									onClick={() => {
										setStatus('pending');
										socket.emit(
											'joinRoom',
											room.roomName,
											nickname,
											spelnaam
										);
										setTimeout(() => {
											router.push(
												`/room/${room.roomName}`
											);
										}, 200);
									}}
									className="join-room-button px-8 py-4 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
								>
									Toetreden
								</button>
							</div>
						))}
					</div>
				</main>
			</div>
			{isTourActive && (
				<Joyride
					styles={{
						options: {
							primaryColor: '#2664EB',
						},
					}}
					locale={{
						back: 'Terug',
						close: 'Afsluiten',
						last: 'Afsluiten',
						next: 'Volgende',
						skip: 'Overslaan',
					}}
					steps={steps}
					continuous={true}
					scrollToFirstStep={false}
					showSkipButton={true}
					run={true}
					callback={(data) => {
						const { status } = data;
						if (status === 'finished' || status === 'skipped') {
							setIsTourActive(false);
						}
					}}
				/>
			)}
		</>
	);
}
