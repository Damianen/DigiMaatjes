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
import { Joyride, Placement } from 'react-joyride';

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

	const [isRulesActive, setIsRulesActive] = useState(false);

	const toggleGameRules = () => {
		setIsRulesActive(false);
		setIsRulesActive(true);
	};

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
			if (context && !gameWon) {
				// Prevent drawing when the game is won
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

					// Clear the entire area
					context.clearRect(
						centerStartX * squareSize,
						centerStartY * squareSize,
						3 * squareSize,
						3 * squareSize
					);

					// Fill the entire area with the current color
					context.fillStyle = fillColor;
					context.fillRect(
						centerStartX * squareSize,
						centerStartY * squareSize,
						3 * squareSize,
						3 * squareSize
					);

					// Clear and fill the corners with the background color (or no fill if transparent)
					const cornerSize = squareSize; // Assuming each corner is a square of the same size as one unit

					// Clear top-left corner
					context.clearRect(
						centerStartX * squareSize,
						centerStartY * squareSize,
						cornerSize,
						cornerSize
					);

					// Clear top-right corner
					context.clearRect(
						(centerStartX + 2) * squareSize,
						centerStartY * squareSize,
						cornerSize,
						cornerSize
					);

					// Clear bottom-left corner
					context.clearRect(
						centerStartX * squareSize,
						(centerStartY + 2) * squareSize,
						cornerSize,
						cornerSize
					);

					// Clear bottom-right corner
					context.clearRect(
						(centerStartX + 2) * squareSize,
						(centerStartY + 2) * squareSize,
						cornerSize,
						cornerSize
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
	}, [board, gameWon]);

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

	const steps = [
		{
			target: '.game-board',
			content:
				'Dit is het spelbord. Hierop speel je het spel. Ieder speler heeft vier pionnen in hun specifieke kleur.',
			placement: 'right' as Placement,
			disableBeacon: true,
			scrollable: false,
		},
		{
			target: '.game-board',
			content:
				'Elke speler begint met hun pionnen in hun thuishaven. Je moet eerst een 6 gooien om een pion in het spel te krijgen.',
			placement: 'right' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.game-board',
			content:
				'Zodra een pion in het spel is, beweeg je deze vooruit volgens het aantal ogen dat je gooit met de dobbelsteen.',
			placement: 'right' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.game-board',
			content:
				'Je kunt een pion van een andere speler slaan door op dezelfde positie te landen. Het geslagen pion gaat terug naar zijn thuishaven.',
			placement: 'right' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.game-board',
			content:
				'Je moet je pionnen naar het midden van het bord brengen om te winnen. De eerste speler die al zijn pionnen in het midden krijgt, wint!',
			placement: 'right' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.ludo-roll-dice',
			content:
				'Je kunt de dobbelsteen gooien door op de "Gooi dobbelsteen" knop te drukken. De waarde bepaalt hoeveel je een pion mag verplaatsen.' +
				' Als je een 6 gooit, mag je een pion in het spel brengen.',
			placement: 'top' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.die',
			content:
				'Hier zie je de dobbelsteen, die rolt wanneer iemand de dobbelsteen gooit.',
			placement: 'right' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
		{
			target: '.turn-announcement',
			content:
				'Om te zien wie aan de beurt is en wat de huidige status van het spel is, kunt u hier kijken',
			placement: 'top' as Placement,
			disableBeacon: true,
			disableScrolling: true,
		},
	];

	return gameStarted ? (
		<div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto px-4 min-h-screen mt-4">
			{/* Canvas for the game board */}
			<div className="w-full lg:w-2/3 mb-4 lg:mb-0 flex justify-center items-center lg:flex-grow">
				<canvas
					className="game-board w-full max-w-3xl"
					ref={canvasRef}
					onClick={choosePawn}
					style={{ height: '690px', maxWidth: '100%' }}
				/>
			</div>

			{/* Buttons and game status container */}
			<div className="flex flex-col items-center justify-center w-full lg:w-1/3 space-y-4 px-4 lg:pt-0 pt-6">
				{/* Button for showing rules */}
				<button
					onClick={toggleGameRules}
					className="bg-yellow-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 w-full max-w-xs"
				>
					Spelregels
				</button>

				{/* Dice roll container */}
				<div
					className={`die w-16 h-16 rounded-lg border border-gray-300 flex justify-center items-center text-4xl shadow-lg ${isRolling ? 'animate-roll' : ''}`}
				>
					<i
						className={`fas ${getDieFace(dice)}`}
						style={{ fontSize: '3.5rem' }}
					></i>
				</div>

				{/* Dice roll button */}
				<div className="ludo-roll-dice w-full flex justify-center">
					{turnState === 1 ? (
						<button
							className="bg-blue-500 text-white px-3 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full max-w-xs"
							onClick={rollDice}
						>
							Gooi dobbelsteen
						</button>
					) : (
						<div
							className="invisible px-5 py-3 rounded-lg"
							style={{ height: '2.5rem', width: '9rem' }}
						></div>
					)}
				</div>

				{/* Turn information and announcements */}
				<div className="text-center text-lg mt-4 space-y-4 w-full">
					<p>
						Jouw kleur is:{' '}
						<span className="font-bold">{color}</span>
					</p>
					{turnState === 1 || turnState === 2 ? (
						<p className="turn-announcement font-bold text-blue-600 mt-2">
							Het is nu jouw beurt
						</p>
					) : (
						<p className="turn-announcement text-gray-700 mt-2">
							Het is de beurt van{' '}
							<span className="font-bold">{currentColor}</span>
						</p>
					)}
					{won != null && (
						<p className="font-bold text-green-600 mt-4">
							{won} heeft het spel gewonnen!!!
						</p>
					)}
					<p className="mt-4 text-gray-500">{announcement}</p>
				</div>
			</div>

			{/* Joyride for rules walkthrough */}
			{isRulesActive && (
				<Joyride
					styles={{
						options: {
							primaryColor: '#2664EB',
							zIndex: 1000,
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
					scrollToFirstStep={true}
					showSkipButton={true}
					run={true}
					callback={(data) => {
						const { status } = data;
						if (status === 'finished' || status === 'skipped') {
							setIsRulesActive(false);
						}
					}}
				/>
			)}
		</div>
	) : null;
}
