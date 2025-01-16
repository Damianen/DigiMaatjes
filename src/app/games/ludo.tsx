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
import '@fortawesome/fontawesome-free/css/all.min.css';

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
	const [gameWon, setGameWon] = useState<boolean>(false);
	const squareSize: number = height / 15;
	const [isRolling, setIsRolling] = useState(false);
	const [announcement, setAnnouncement] = useState<string>('');

	const rollDice = () => {
		if (turnState === 1) {
			setTurnState(2);
			setIsRolling(true);
			setTimeout(() => {
				const number = Math.floor(Math.random() * 6) + 1;
				setDice(number);
				socket.emit('dice', number, room);
			}, 500);
		} else if (turnState === 2) {
			setAnnouncement('Je hebt al gegooit klik op een van je pionen');
		} else {
			setAnnouncement('Je bent nog niet aan de beurt!');
		}
	};

	const choosePawn = (event: React.MouseEvent) => {
		if (turnState !== 2) {
			if (turnState === 1) {
				setAnnouncement('Gooi eerst de dobbelsteen!');
			} else {
				setAnnouncement('Je bent niet aan de beurt!');
			}
			return;
		}

		const rect = canvasRef.current!.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / squareSize);
		const y = Math.floor((event.clientY - rect.top) / squareSize);

		if (board[y][x].pawn != null && board[y][x].pawn.color === color) {
			const pos: IPosition = { x, y };

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
		} else {
			setAnnouncement('Klik op een van jouw pionen');
		}
	};

	const img = new Image();
	img.src = ludoboard.src;

	useEffect(() => {
		socket.on('dice', (dice: number) => {
			setIsRolling(true);
			setTimeout(() => {
				setDice(dice);
				setIsRolling(false);
			}, 500);
		});
		socket.on('board', (data: LudoClientGameData) => {
			if (data.won != null) {
				setWon(data.won);
				setTurnState(0);
				setGameWon(true);
				setGameStarted(false);
			}
			setCurrentColor(data.player.color);
			if (data.player.color === color) {
				setTurnState(1);
			}
			setBoard(data.board);
		});
		socket.on(
			'startGame',
			(players: LudoPlayer[], currentPlayer: LudoPlayer) => {
				setGameStarted(true);
				players.forEach((player) => {
					if (player.user === socket.id) {
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
	}, [color]);

	useEffect(() => {
		function draw(context: CanvasRenderingContext2D) {
			if (context && !gameWon) { // Prevent drawing when the game is won
				context.drawImage(img, 0, 0);
		
				// Fully cover the center of the board with the current player's color
				if (currentColor !== LudoPlayerColor.NULL) {
					const centerStartX = 6; // 3x3 square starts at x6
					const centerStartY = 6; // 3x3 square starts at y6
		
					let fillColor = '';
					switch (currentColor) {
						case LudoPlayerColor.BLUE:
							fillColor = 'blue';
							break;
						case LudoPlayerColor.YELLOW:
							fillColor = 'yellow';
							break;
						case LudoPlayerColor.RED:
							fillColor = 'rgb(254, 17, 1)';
							break;
						case LudoPlayerColor.GREEN:
							fillColor = 'green';
							break;
					}
		
					// Clear the center area first
					context.clearRect(
						centerStartX * squareSize,
						centerStartY * squareSize,
						3 * squareSize,
						3 * squareSize
					);
		
					// Fill the cleared area with the current color
					context.fillStyle = fillColor;
					context.fillRect(
						centerStartX * squareSize,
						centerStartY * squareSize,
						3 * squareSize,
						3 * squareSize
					);
				}
		
				// Draw pawns on the board
				for (let x = 0; x < board.length; x++) {
					for (let y = 0; y < board[x].length; y++) {
						const square = board[y][x];
						if (square.pawn != null) {
							const pawn = square.pawn;
							if (
								pawn.color === color &&
								(turnState === 1 || turnState === 2)
							) {
								context.strokeStyle = 'gold';
								context.lineWidth = 3;
								context.beginPath();
								context.arc(
									x * squareSize + squareSize / 2,
									y * squareSize + squareSize / 2,
									18,
									0,
									2 * Math.PI
								);
								context.stroke();
							}
		
							switch (pawn.color) {
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
	}, [board, gameWon]); // Added gameWon as a dependency

	const getDieFace = (value: number) => {
		switch (value) {
			case 1:
				return 'fa-dice-one';
			case 2:
				return 'fa-dice-two';
			case 3:
				return 'fa-dice-three';
			case 4:
				return 'fa-dice-four';
			case 5:
				return 'fa-dice-five';
			case 6:
				return 'fa-dice-six';
			default:
				return '';
		}
	};

	return gameStarted ? (
		<>
			<canvas ref={canvasRef} onClick={choosePawn} />
			<div className="flex flex-col items-center mb-4">
				<div
					className={`die w-12 h-12 rounded-lg border border-gray-300 m-2 flex justify-center items-center text-3xl shadow-lg ${
						isRolling ? 'animate-roll' : ''
					}`}
				>
					<i
						className={`fas ${getDieFace(dice)}`}
						style={{ fontSize: '3.5rem' }}
					></i>
				</div>
				{turnState === 1 && (
					<div className="ludo-roll-dice">
						<button
							className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
							onClick={rollDice}
						>
							Gooi dobbelsteen
						</button>
					</div>
				)}

				<div className="text-center">
					<p>Jouw kleur is: {color}</p>
					{turnState === 1 || turnState === 2 ? (
						<p>Het is nu jou beurt</p>
					) : (
						<p>Het is de beurt van {currentColor}</p>
					)}
					{won != null && <p>{won} heeft het spel gewonnen!!!</p>}
					{announcement}
				</div>
			</div>
		</>
	) : null;
}
