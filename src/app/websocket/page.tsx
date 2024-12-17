'use client';

import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useRouter } from 'next/navigation';

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState('N/A');
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState('');
	const [roomMessage, setRoomMessage] = useState<string[]>([]);
	const router = useRouter();
	const [roomInput, setRoomInput] = useState('');

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

		socket.on('chat message', (msg: string) => {
			setMessages((prevMessages) => [...prevMessages, msg]);
		});

		socket.on('room message', (msg: string) => {
			console.log('room Message', msg);
			setRoomMessage((prevroomMessages) => [...prevroomMessages, msg]);
		});

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('chat message');
            socket.off('room message');
		};
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input) {
			socket.emit('chat message', input);
			setInput('');
		}
	};

	const handleSendRoomMessag = (e: React.FormEvent) => {
		e.preventDefault();
		if (roomInput) {
			socket.emit('roomMessage', 1, roomInput);
			setRoomInput('');
		}
	};

	const handleLeaveRoom = () => {
		socket.emit('leaveRoom', 1);
		router.push('/user');
	};

	return (
		<div>
			<h1>Room chat</h1>
			<div>
				<ul>
					{roomMessage.map((msg, index) => (
						<li key={index} className="odd:bg-gray-200">
							{msg}
						</li>
					))}
				</ul>
			</div>

			<form onSubmit={handleSendRoomMessag}>
				<input
					type="text"
					value={roomInput}
					onChange={(e) => setRoomInput(e.target.value)}
				/>
				<button type="submit">Send Room</button>
			</form>
			<h1>Chat</h1>
			<ul>
				{messages.map((msg, index) => (
					<li key={index} className="odd:bg-gray-200">
						{msg}
					</li>
				))}
			</ul>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button type="submit">Send</button>
			</form>
			<button onClick={handleLeaveRoom}>Leave Room</button>
		</div>
	);
}
