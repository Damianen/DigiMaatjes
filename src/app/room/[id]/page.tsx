'use client';

import { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { useRouter, useParams } from 'next/navigation';

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	// const [messages, setMessages] = useState<string[]>([]);
	// const [input, setInput] = useState('');
	const [roomMessage, setRoomMessage] = useState<string[]>([]);
	const router = useRouter();
	const [roomInput, setRoomInput] = useState('');
	const[nickname, setNickname] = useState('');
	const [users, setUsers] = useState<string[]>([]);
	const roomId = useParams().id?.toString();
	const room = roomId ?roomId : "0";
	const spelnaam = room.split('-')[0];

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}
		console.log (nickname)
		

		function getRoomIds(room: string) {
			console.log('getRoomUsers', room);
			socket.emit('getRoomUsers', room);
		}
		function onConnect() {
			setIsConnected(true);
			console.log (nickname)
			console.log(room)
			setTransport(socket.io.engine.transport.name);
			socket.io.engine.on('upgrade', (transport) => {
				setTransport(transport.name);
			});
			getRoomIds(room);
		}

		

		function onDisconnect() {
			setIsConnected(false);
			setTransport('N/A');
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		// socket.on('chat message', (msg: string) => {
		// 	setMessages((prevMessages) => [...prevMessages, msg]);
		// });

		socket.on('room message', (msg: string) => {
			console.log('room Message', msg);
			setRoomMessage((prevroomMessages) => [...prevroomMessages, msg]);
		});

		socket.on('socket nickname', (nickname: string) => {
			console.log('socket nickname', nickname);
			setNickname(nickname);
		});

		socket.on('joinRoom', (room: string) => {
			console.log('joinRoom', room);
			getRoomIds(room);
		});

		socket.on('getRoomUsers', (users: string[]) => {
			for (const user of users) {
				console.log('user', user);
			}
			setUsers(users);
		});

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			// socket.off('chat message');
			socket.off('room message');
			socket.off('getRoomUsers');
			socket.off('joinRoom');
		};
	}, []);

	// const handleSubmit = (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (input) {
	// 		socket.emit('chat message', input);
	// 		setInput('');
	// 	}
	// };

	const handleSendRoomMessag = (e: React.FormEvent) => {
		e.preventDefault();
		if (roomInput) {
			socket.emit('roomMessage', room, roomInput);
			setRoomInput('');
		}
	};

	const handleLeaveRoom = () => {
		socket.emit('leaveRoom', room);
		router.push(`/speloverzicht/${spelnaam}`);
	};

	const handleStartGame = () => {
		console.log('start game');
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
		  <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
			<h1 className="text-2xl font-bold mb-4">Welcome to room : {room}</h1>
	
			{/* Users List */}
			<div className="mb-4">
			  <h2 className="text-xl font-semibold mb-2">People in the Room:</h2>
			  <ul className="list-disc list-inside">
				{users.map((user, index) => (
				  <li key={index} className="text-gray-700">
					{user}
				  </li>
				))}
			  </ul>
			</div>
	
			{/* Chat Section */}
			<div className="mb-4">
			  <h2 className="text-xl font-semibold mb-2">Chat:</h2>
			  <div className="border rounded-lg h-60 overflow-y-scroll p-3 bg-gray-50 mb-2 odd:bg-gray-100">
				{roomMessage.map((message, index) => (
				  <div key={index} className="mb-2">
					{message}
				  </div>
				))}
			  </div>
			  <div className="flex gap-2">
				<input
				  type="text"
				  className="flex-1 border rounded-lg p-2"
				  placeholder="Type your message..."
				  value={roomInput}
				  onChange={(e) => setRoomInput(e.target.value)}
				/>
				<button
				  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
				  onClick={handleSendRoomMessag}
				>
				  Send
				</button>
			  </div>
			</div>
	
			{/* Action Buttons */}
			<div className="flex justify-between">
			  <button
				className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
				onClick={handleLeaveRoom}
			  >
				Leave Room
			  </button>
			  <button
				className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
				onClick={handleStartGame}
			  >
				Start Game
			  </button>
			</div>
		  </div>
		</div>
	  );
	};
	