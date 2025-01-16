'use client';

import { getUserName } from '@/lib/dal/user.dal';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Ludo from '../../games/ludo';
import { socket } from '../../socket';
import Navbar from '../../component/navbar';
import Link from 'next/link';
import { Joyride, Placement } from 'react-joyride';

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	const [roomMessage, setRoomMessage] = useState<string[]>([]);
	const router = useRouter();
	const [roomInput, setRoomInput] = useState('');
	const [nickname, setNickname] = useState('');
	const [isInitialJoinDone, setIsInitialJoinDone] = useState(false);
	const [users, setUsers] = useState<string[]>([]);
	const roomId = useParams().id?.toString();
	const room = roomId ? roomId : '0';
	const spelnaam = room.split('-')[0];

	const [isTourActive, setIsTourActive] = useState(false);
	const [windowWidth, setWindowWidth] = useState<number>(0);

	const toggleExplanation = () => {
		setIsTourActive(false);
		setIsTourActive(true);
	};

	useEffect(() => {
		async function initialize() {
			if (!nickname) {
				const user = await getUserName();
				if (user) {
					setNickname(user as string);
				}
			}
		}

		initialize();
	}, []);

	useEffect(() => {
		if (nickname && !isInitialJoinDone) {
			handleJoinRoom(); // Join room once nickname is available
			setIsInitialJoinDone(true); // Prevent multiple joins
		}
	}, [nickname, isInitialJoinDone]);

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);

			socket.io.engine.on('upgrade', (transport) => {
				setTransport(transport.name);
			});
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		socket.on('room message', (msg: string) => {
			setRoomMessage((prevroomMessages) => [...prevroomMessages, msg]);
		});

		socket.on('joinRoom', () => {
			getRoomIds(room);
		});

		socket.on('getRoomUsers', (users: string[]) => {
			setUsers(users);
		});

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('room message');
			socket.off('getRoomUsers');
			socket.off('joinRoom');
			if (isConnected || transport) {
				// error voorkomen!
			}
		};
	}, [room]);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	function handleJoinRoom() {
		if (nickname && room) {
			socket.emit('joinRoom', room, nickname);
			getRoomIds(room);
		}
	}

	function getRoomIds(room: string) {
		socket.emit('getRoomUsers', room);
	}

	const handleSendRoomMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (roomInput) {
			socket.emit('roomMessage', room, roomInput);
			setRoomInput('');
		}
	};

	const handleLeaveRoom = () => {
		socket.emit('leaveRoom', room, spelnaam);
		router.push(`/speloverzicht/${spelnaam}`);
	};

	const handleStartGame = () => {
		socket.emit('startGame', room);
	};

	const steps = [
		{
			target: '.room-name',
			content:
				'Hier zie je de naam van de kamer waar je in zit. Als je met vrienden wilt spelen kun je de kamer naam delen',
			placement: 'bottom' as Placement,
			disableBeacon: true,
		},

		{
			target: '.chat-room-user',
			content: 'Hier zie je de gebruikers in de kamer en ook de chatroom',
			placement: 'left' as Placement,
			disableBeacon: true,
		},
		{
			target: '.game-start',
			content:
				'Als eenmaal iedereen in de kamer zit en je een spel wilt starten kunt u op de spel starten knop klikken om het spel te starten.',
			placement: 'top' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.leave-room',
			content:
				'Als je de kamer wilt verlaten kun je op de kamer verlaten knop klikken om de kamer te verlaten.',
			placement: 'top' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
	];

	return (
		<>
			<Navbar />
			<div
				className={`min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center p-4 ${
					windowWidth < 1024 ? 'overflow-hidden' : ''
				}`}
			>
				<div className="flex items-center my-4">
					<h1 className="room-name text-5xl font-bold font-bambino text-white mr-4">
						Kamer: {room}
					</h1>
					<button
						onClick={toggleExplanation}
						className="text-white bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						?
					</button>
				</div>

				<div className="flex flex-col lg:flex-row w-full max-w-6xl lg:space-x-4 space-y-4 lg:space-y-0 items-stretch">
					{/* Ludo Game Section */}
					<div className="flex-1 bg-white rounded-lg shadow-lg p-6 flex flex-col">
						<Ludo />
					</div>

					{/* Chat and Users Section */}
					<div className="chat-room-user w-full lg:w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col">
						<h2 className="text-xl font-semibold mb-4">
							Gebruikers in de kamer:
						</h2>
						<ul className="list-disc list-inside">
							{users.length === 0 ? (
								<p className="text-gray-400 italic">
									Geen gebruikers in deze kamer.
								</p>
							) : (
								users.map((user, index) => (
									<li key={index} className="text-gray-700">
										<Link
											href={`/profile/${user}`}
											target="blank"
										>
											{user}
										</Link>
									</li>
								))
							)}
						</ul>

						<h2 className="text-xl font-semibold mt-4">Chat:</h2>

						<div className="flex-1 border rounded-lg overflow-y-auto p-3 bg-gray-50 mb-4 min-h-[200px]">
							{roomMessage.length === 0 ? (
								<p className="text-gray-400 italic">
									Geen berichten in deze kamer, start een
									gesprek!
								</p>
							) : (
								roomMessage.map((message, index) => (
									<div
										key={index}
										className="mb-2 break-words"
									>
										{message}
									</div>
								))
							)}
						</div>
						<div className="flex flex-col sm:flex-row gap-2 mb-6">
							<input
								type="text"
								className="flex-1 border rounded-lg p-2"
								placeholder="Type your message..."
								value={roomInput}
								onChange={(e) => setRoomInput(e.target.value)}
							/>
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
								onClick={handleSendRoomMessage}
							>
								Versturen
							</button>
						</div>
					</div>
				</div>

				{/* Bottom Buttons */}
				<div className="flex justify-between mt-8 w-full max-w-6xl">
					<button
						className="leave-room bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
						onClick={handleLeaveRoom}
					>
						Kamer verlaten
					</button>
					<button
						className="game-start bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
						onClick={handleStartGame}
					>
						Spel starten
					</button>
				</div>
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
