'use client';

import { newBoard } from '@/games/ludo/board';
import { LudoGame } from '@/games/ludo/ludo';
import { LudoGameFactory } from '@/games/ludo/ludo.factory';
import { LudoPlayerColor } from '@/games/ludo/ludo.player';
import { IPosition } from '@/models/game.interface';
import { LudoBoardSquare, LudoGameDataFacotry } from '@/models/ludo.interface';
import { User } from '@/models/user.interface';
import { useEffect, useRef, useState } from 'react';

export default function Ludo({ height = 691, width = 691 }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number>(0);
	const [users, setUsers] = useState<User[]>([
		new User(),
		new User(),
		new User(),
	]);
	const [game, setGame] = useState<LudoGame>(
		new LudoGameFactory().createGame(users) as LudoGame
	);
	const [turnState, setTurnState] = useState<number>(1);
	const [dice, setDice] = useState<number>(0);

	const squareSize: number = height / 15;

	const rollDice = () => {
		if (turnState == 1) {
			setDice(Math.floor(Math.random() * (6 - 1 + 1) + 1));
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

		if (game.board[y][x].pawn) {
			const pos: IPosition = {
				x: x,
				y: y,
			};

			game.takeTurn(
				new LudoGameDataFacotry().createServerData({
					dice: dice,
					pawn: game.board[y][x].pawn,
					position: pos,
				})
			);

			setTurnState(1);
		}
	};

	useEffect(() => {
		function draw(context: CanvasRenderingContext2D) {
			if (context) {
				const img = new Image();
				img.src = 'ludo/ludoboard.jpg';

				img.addEventListener('load', () => {
					context.drawImage(img, 0, 0);
				});

				for (let x = 0; x < game.board.length; x++) {
					for (let y = 0; y < game.board[x].length; y++) {
						if (game.board[y][x].pawn != null) {
							switch (game.board[y][x].pawn?.color) {
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
	}, [height, width, game.board]);

	return (
		<>
			<canvas ref={canvasRef} onClick={choosePawn} />
			<p> last dice roll: {dice}</p>
			<button onClick={rollDice}>Roll dice</button>
		</>
	);
}
