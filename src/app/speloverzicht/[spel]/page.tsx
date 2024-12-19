'use client';
import Image from 'next/image';
import Navbar from '@/app/component/navbar';
import { useParams, useRouter } from 'next/navigation';
import { socket } from '../../socket';
import { useState, useEffect } from 'react';

interface Room{
	roomName: string;
	numUsers: number;
}

export default function GameRoom() {
	const router = useRouter();
	const spel = useParams().spel?.toString();
	const spelnaam = spel ? spel : 'Mens erger je niet';
	const spelimg = `/img/${spelnaam}.jpg`;
	const nickname = 'Digimaatje';
	let gameRealName = spelnaam;
	if (spelnaam == 'Mensergerjeniet') {
		gameRealName = 'Mens erger je niet';
	}
	const [rooms, setRooms] = useState<Room[]>([]);
	// const [usersInRoom, setUsersInRoom] = useState<number>(0);	
	const id = rooms.length + 1;

	useEffect(() => {
		findRooms();
	}, []);

	function findRooms() {
		socket.emit('findRooms', spelnaam);
		socket.on('rooms', (rooms: Room[]) => {
			console.log(rooms);
			setRooms(rooms);
		});
	}

	function handleCreateGame(){
		socket.emit('createRoom', `${spelnaam}-${id}`, nickname);
		router.push(`/room/${spelnaam}-${id}`);
	}

	// function findUsersInRoom(room: string) {
	// 	socket.emit('findUsersInRoom', room);
	// 	socket.on('numberOfUsers', (users: number) => {
	// 		setUsersInRoom(users);
	// 	});
	// 	return usersInRoom;
	// }

	const [showExplanation, setShowExplanation] = useState(false);

	const toggleExplanation = () => {
		setShowExplanation(!showExplanation);
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center px-4">
				<main className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 mt-10">
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

						<div className="flex items-center gap-x-6 relative">
							<button onClick = {handleCreateGame} className="px-8 py-3 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
								Creëer zelf spel
							</button>

							<button
								onClick={toggleExplanation}
								className="text-white bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
							>
								?
							</button>

							{showExplanation && (
								<div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white text-blue-700 text-sm rounded-lg shadow-lg p-4 w-64 z-10">
									<p>
										Deze kamer is waar spelers kunnen
										samenkomen om een spel te spelen. Druk
										op Join om mee te doen aan de kamer
										van een vriend!
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
						
					</div>
				
					<div className="grid grid-cols-1 gap-6">
						{rooms.map((room, index) => (
							<div
								key={index}
								className="flex items-center justify-between bg-blue-100 p-4 rounded-lg shadow"
							>
								<div className="flex-1 text-lg font-semibold font-bambino">
									{room.roomName}
								</div>
								<div className="text-lg flex-shrink-0 min-w-[80px] text-center mr-20">
									Users: {room.numUsers}/4
								</div>
                                <button onClick={()=>{
							socket.emit('joinRoom', room.roomName, nickname);
							router.push(`/room/${room.roomName}`);
									}}
									className="px-8 py-4 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
								>
									Join
								</button>
							</div>
						))}
					</div>
				</main>
			</div>
		</>
	);
}
