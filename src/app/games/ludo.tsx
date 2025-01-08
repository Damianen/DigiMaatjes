'use client';

import { newBoard } from '@/games/ludo/board';
import { LudoGame } from '@/games/ludo/ludo';
import { LudoGameFactory } from '@/games/ludo/ludo.factory';
import { LudoPlayerColor } from '@/games/ludo/ludo.player';
import { IPosition } from '@/models/game.interface';
import {
	LudoBoardSquare,
	LudoClientGameData,
	LudoGameDataFacotry,
	LudoPawn,
} from '@/models/ludo.interface';
import { User } from '@/models/user.interface';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { routeModule } from 'next/dist/build/templates/pages';
import { useParams } from 'next/navigation';
import ludoboard from '../../../public/img/ludoboard.jpg';

export default function Ludo({ height = 691, width = 691 }) {
	const roomId = useParams().id?.toString();
	const room = roomId ? roomId : '0';
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number>(0);
	const [board, setBoard] = useState<LudoBoardSquare[][]>(newBoard);
	const [turnState, setTurnState] = useState<number>(1);
	const [dice, setDice] = useState<number>(0);

	const squareSize: number = height / 15;

	const rollDice = () => {
		console.log('rol ', turnState);
		if (turnState == 1) {
			const number = Math.floor(Math.random() * (6 - 1 + 1) + 1);
			setDice(number);
			socket.emit('dice', number, room);
			setTurnState(2);
		}
	};

	const choosePawn = (event: React.MouseEvent) => {
		if (turnState != 2) {
			return;
		}

		let rect = canvasRef.current!.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left) / squareSize);
		let y = Math.floor((event.clientY - rect.top) / squareSize);

		if (board[y][x].pawn) {
			const pos: IPosition = {
				x: x,
				y: y,
			};

			socket.emit(
				'takeTurn',
				new LudoGameDataFacotry().createServerData({
					dice: dice as number,
					pawn: board[y][x].pawn as LudoPawn,
					position: pos as IPosition,
				}),
				room
			);

			setTurnState(1);
		}
	};

	const img = new Image();
	img.src = ludoboard.src;

	useEffect(() => {
		socket.on('dice', (dice: number) => {
			setDice(dice);
		});
		socket.on('board', (board: LudoClientGameData) => {
			console.log('board set ', board);
			setBoard(board.getData().board);
		});
	});

	useEffect(() => {
		function draw(context: CanvasRenderingContext2D) {
			if (context) {
				context.drawImage(img, 0, 0);

				for (let x = 0; x < board.length; x++) {
					for (let y = 0; y < board[x].length; y++) {
						if (board[y][x].pawn != null) {
							switch (board[y][x].pawn?.color) {
								case LudoPlayerColor.BLUE:
									context.fillStyle = 'blue';
									break;
								case LudoPlayerColor.YELLOW:
									context.fillStyle = 'yellow';
									break;
								case LudoPlayerColor.RED:
									context.fillStyle = 'rgb(160, 0, 0)';
									break;
								case LudoPlayerColor.GREEN:
									context.fillStyle = 'green';
									break;
							}

							context.beginPath();
							context.arc(
								x * squareSize + squareSize / 2,
								y * squareSize + squareSize / 2,
								15,
								0,
								2 * Math.PI
							);
							context.fill();
						}
					}
				}

				frameRef.current = requestAnimationFrame(() => draw(context));
			}
		}
		if (canvasRef.current) {
			const context = canvasRef.current.getContext('2d');

			if (context) {
				context.canvas.height = height;
				context.canvas.width = width;

				frameRef.current = requestAnimationFrame(() => draw(context));
			}
		}
		return () => cancelAnimationFrame(frameRef.current);
	}, [board]);

	return (
		<>
			<canvas ref={canvasRef} onClick={choosePawn} />
			<p> last dice roll: {dice}</p>
			<button onClick={rollDice}>Roll dice</button>
		</>
	);
}
