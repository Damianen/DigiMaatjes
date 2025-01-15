import next from 'next';
import { createServer } from 'node:http';
import { LudoGameFactory } from '@/lib/games/ludo/ludo.factory';
import { LudoPlayer, LudoPlayerColor } from '@/lib/games/ludo/ludo.player';
import { LudoClientGameData } from '@/lib/models/ludo.interface';
import { Server, Socket } from 'socket.io';
import { createClient } from 'redis';
import { LudoGame } from '@/lib/games/ludo/ludo';

const MAX_USERS = 4;
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
console.log(process.env.PORT);
const port: any = process.env.PORT || '3000';
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, port });
const handler = app.getRequestHandler();

const redisClient = createClient({
	url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.prepare().then(async () => {
	await redisClient.connect();
	const httpServer = createServer(handler);
	const io = new Server(httpServer);

	const shownrooms = new Map();
	const rooms = io.sockets.adapter.rooms;
	io.on('connection', (socket: Socket & { nickname?: string }) => {
		console.log('a user connected');
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		socket.on('chat message', (msg) => {
			console.log('message: ' + msg);
			socket.emit('chat message', `${socket.id}: ${msg}`);
		});
		socket.on('joinRoom', (room, nickname, spelnaam) => {
			socket.nickname = nickname;
			socket.join(room);
			console.log('user joined room #' + room + ' as ' + nickname);
			socket.to(room).emit('joinRoom', room);
			socket.emit('joinRoom', room);
			const numberOfUsers = io.sockets.adapter.rooms.get(room)!.size;
			shownrooms.set(room, { roomName: room, numUsers: numberOfUsers });
			console.log('shownrooms', Array.from(shownrooms.values()));
			io.emit('updateRooms', Array.from(shownrooms.values()));
		});
		socket.on('createRoom', (room, nickname, spelnaam) => {
			socket.nickname = nickname;
			socket.join(room);
			console.log('user created room ' + room + ' as ' + nickname);
			const numberOfUsers = io.sockets.adapter.rooms.get(room)!.size;
			shownrooms.set(room, { roomName: room, numUsers: numberOfUsers });
			console.log('shownrooms', Array.from(shownrooms.values()));
			io.emit('updateRooms', Array.from(shownrooms.values()));
		});
		socket.on('leaveRoom', async (room, spelnaam) => {
			socket.leave(room);
			console.log('user left room #' + room);

			// Fetch the updated list of users in the room
			try {
				const sockets = await io.in(room).fetchSockets();
				const users = sockets.map((socket) => socket.id);
				console.log(users);
				io.to(room).emit('getRoomUsers', users);
			} catch (error) {
				console.error('Error fetching room users:', error);
			}
			const numberOfUsers = io.sockets.adapter.rooms.get(room)?.size || 0;
			if (numberOfUsers === 0) {
				shownrooms.delete(room);
			} else {
				shownrooms.set(room, {
					roomName: room,
					numUsers: numberOfUsers,
				});
			}
			console.log('shownrooms', Array.from(shownrooms.values()));
			io.emit('updateRooms', Array.from(shownrooms.values()));
		});
		socket.on('roomMessage', (room, msg) => {
			console.log('room message: ' + msg);
			console.log('room: ' + room);
			io.to(room).emit('room message', `${socket.nickname}: ${msg}`);
		});

		socket.on('getRoomUsers', async (room) => {
			console.log('getRoomUsers: ' + room);
			try {
				const sockets = await io.in(room).fetchSockets();
				const users = sockets.map((socket) => socket.id);
				console.log(users);
				console.log('getRoomUsers is called');
				socket.emit('getRoomUsers', users);
				socket.emit('socket nickname', socket.nickname);
			} catch (error) {
				console.error('Error fetching room users:', error);
			}
		});

		socket.on('findRooms', async (spelnaam) => {
			const shownrooms: Array<object> = [];
			console.log(rooms);
			rooms.forEach((value, key) => {
				const numberOfUsers = value.size;
				if (key.includes(spelnaam) && numberOfUsers < MAX_USERS) {
					console.log(value, key);
					shownrooms.push({ roomName: key, numUsers: numberOfUsers });
				}
			});
			console.log('shownrooms', shownrooms);
			socket.emit('updateRooms', shownrooms);
		});

		socket.on('findUsersInRoom', async (room) => {
			console.log('findUsersInRoom: ' + room);
			const numberOfUsers = io.sockets.adapter.rooms.get(room)!.size;
			console.log('numberOfUsers: ' + numberOfUsers);
			socket.emit('numberOfUsers', numberOfUsers);
		});

		//Sockets for Ludo
		socket.on('startGame', async (room: string) => {
			const sockets = await io.in(room).fetchSockets();
			const users = sockets.map((socket) => socket.id);
			const players: LudoPlayer[] = [];
			let i = 0;
			users.forEach((user) => {
				if (i == 0) {
					players.push(new LudoPlayer(user, LudoPlayerColor.BLUE));
				} else if (i == 1) {
					players.push(new LudoPlayer(user, LudoPlayerColor.RED));
				} else if (i == 2) {
					players.push(new LudoPlayer(user, LudoPlayerColor.GREEN));
				} else {
					players.push(new LudoPlayer(user, LudoPlayerColor.YELLOW));
				}
				i++;
			});
			const ludo = new LudoGameFactory().createGame(players);
			const json = JSON.stringify(ludo);
			await redisClient.set(room, json);
			io.to(room).emit('startGame', players, ludo.currentPlayer);
		});

		socket.on('dice', (dice, roomname) => {
			console.log(dice + 'to room ' + roomname);
			io.to(roomname).emit('dice', dice);
		});

		socket.on('takeTurn', async (data, room) => {
			let json = (await redisClient.get(room)) as string;
			const ludo: LudoGame = new LudoGame([]);
			Object.assign(ludo, JSON.parse(json));
			const board = ludo.takeTurn(data);
			json = JSON.stringify(ludo);
			await redisClient.set(room, json);
			io.to(room).emit('board', board);
		});
	});

	httpServer
		.once('error', (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
