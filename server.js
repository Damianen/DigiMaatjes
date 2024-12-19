import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer);


	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		socket.on('chat message', (msg) => {
			console.log('message: ' + msg);
			socket.emit('chat message', `${socket.id} said ${msg}`);
		});
		socket.on('joinRoom', (room, nickname) => {
			socket.nickname = nickname;
			socket.join(room);
			console.log('user joined room #' + room + ' as ' + nickname);
			socket.to(room).emit('joinRoom', room);
			socket.emit('joinRoom', room);
		});
		socket.on('createRoom', (room, nickname) => {
			socket.nickname = nickname;
			socket.join(room);
			console.log('user created room ' + room + ' as ' + nickname);
			socket.emit('createRoom', room);
		});
		socket.on('leaveRoom', (room) => {
			socket.leave(room);
			console.log('user left room #' + room);
		});	
		socket.on('roomMessage', (room, msg) => {
			console.log('room message: ' + msg);
			console.log('room: ' + room);
			io.to(room).emit('room message',`${socket.nickname} said ${msg}`);
		});
		
		socket.on('getRoomUsers', async (room) => {
			console.log('getRoomUsers: ' + room);
			try {
				const sockets = await io.in(room).fetchSockets();
				const users = sockets.map((socket) => socket.nickname);
				console.log(users);
				socket.emit('getRoomUsers', users);
				socket.emit('socket nickname', socket.nickname);
			} catch (error) {
				console.error('Error fetching room users:', error);
			}
		});

		socket.on('findRooms',  async (spelnaam) => {
			const MAX_USERS = 4;
			var shownrooms = [];
			var rooms = io.sockets.adapter.rooms;
			console.log(rooms);
			rooms.forEach((value, key) => {
				const numberOfUsers = value.size;
				if (key.includes(spelnaam)&& numberOfUsers < MAX_USERS) {
					console.log(value, key);
					shownrooms.push({roomName: key, numUsers: numberOfUsers});
				}
			});
			console.log('shownrooms', shownrooms);
			socket.emit('rooms', shownrooms);
		});

		socket.on('findUsersInRoom', async (room) => {
			console.log('findUsersInRoom: ' + room);
			var numberOfUsers = io.sockets.adapter.rooms.get(room).size;
			console.log('numberOfUsers: ' + numberOfUsers);
			socket.emit('numberOfUsers', numberOfUsers);
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
