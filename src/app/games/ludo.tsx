'use client';

import { newBoard } from '@/games/ludo/board';
import { LudoPlayerColor } from '@/games/ludo/ludo.player';
import { IPosition } from '@/models/game.interface';
import { LudoBoardSquare } from '@/models/ludo.interface';
import { useEffect, useRef, useState } from 'react';

export default function Ludo({ height = 691, width = 691 }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number>(0);
	const [board, setBoard] = useState<LudoBoardSquare[][]>(newBoard);

	const squareSize: number = height / 15;

	useEffect(() => {
		function draw(context: CanvasRenderingContext2D) {
			if (context) {
				const img = new Image();
				img.src = 'ludo/ludoboard.jpg';

				img.addEventListener('load', () => {
					context.drawImage(img, 0, 0);
				});

				for (let x = 0; x < board.length; x++) {
					for (let y = 0; y < board[x].length; y++) {
						if (board[y][x].nextPosition) {
							context.beginPath();
							context.moveTo(
								x * squareSize + squareSize / 2,
								y * squareSize + squareSize / 2
							);
							context.lineTo(
								(board[y][x].nextPosition as IPosition).x *
									squareSize +
									squareSize / 2,
								(board[y][x].nextPosition as IPosition).y *
									squareSize +
									squareSize / 2
							);
							context.stroke();
						}

						if (board[y][x].home != null) {
							switch (board[y][x].home) {
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
	}, [height, width, board]);

	return <canvas ref={canvasRef} />;
}
