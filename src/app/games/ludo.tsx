'use client';

import { newBoard } from '@/lib/games/ludo/board';
import { LudoPlayer, LudoPlayerColor } from '@/lib/games/ludo/ludo.player';
import { IPosition } from '@/lib/models/game.interface';
import {
	LudoBoardSquare,
	LudoClientGameData,
	LudoGameDataFacotry,
	LudoPawn,
} from '@/lib/models/ludo.interface';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ludoboard from '../../../public/img/ludoboard.jpg';
import { socket } from '../socket';

export default function Ludo({ height = 691, width = 691 }) {
	const roomId = useParams().id?.toString();
	const room = roomId ? roomId : '0';
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number>(0);
	const [board, setBoard] = useState<LudoBoardSquare[][]>([]);
	const [turnState, setTurnState] = useState<number>(0);
	const [dice, setDice] = useState<number>(0);
	const [color, setColor] = useState<LudoPlayerColor>(LudoPlayerColor.NULL);
	const [won, setWon] = useState<LudoPlayerColor | null>(null);
	const [currentColor, setCurrentColor] = useState<LudoPlayerColor>(
		LudoPlayerColor.NULL
	);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
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

		const rect = canvasRef.current!.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / squareSize);
		const y = Math.floor((event.clientY - rect.top) / squareSize);

		if (board[y][x].pawn != null && board[y][x].pawn.color == color) {
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

			setTurnState(0);
		}
	};

	const img = new Image();
	img.src = ludoboard.src;

	useEffect(() => {
		socket.on('dice', (dice: number) => {
			setDice(dice);
		});
		socket.on('board', (data: LudoClientGameData) => {
			if (data.won != null) {
				setWon(data.won);
				setTurnState(0);
			}
			setCurrentColor(data.player.color);
			if (data.player.color === color) {
				console.log(
					'data player color: ',
					data.player.color,
					'your color: ',
					color
				);
				setTurnState(1);
			}

			setBoard(data.board);
		});
		socket.on(
			'startGame',
			(players: LudoPlayer[], currentPlayer: LudoPlayer) => {
				setGameStarted(true);
				players.forEach((player) => {
					if (player.user == socket.id) {
						console.log(player.color);
						setColor(player.color);
					}
				});

				if (currentPlayer.user === socket.id) {
					setTurnState(1);
				}

				setCurrentColor(currentPlayer.color);
				setBoard(newBoard);
			}
		);
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
		gameStarted && (
			<>
				<canvas ref={canvasRef} onClick={choosePawn} />
				<p> last dice roll: {dice}</p>
				<button onClick={rollDice}>Roll dice</button>
				<p> jouw kleur is: {color}</p>
				{turnState == 1 || turnState == 2 ? (
					<p>Het is nu jou beurt</p>
				) : (
					<p>Het is de beurt van {currentColor}</p>
				)}
				{won != null && <p> {won} has won the game! </p>}
			</>
		)
	);
}
