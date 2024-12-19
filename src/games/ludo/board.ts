import { IPosition } from '@/models/game.interface';
import { LudoPawn } from '@/models/ludo.interface';
import { LudoPlayerColor } from './ludo.player';

export class BoardSquare {
	nextPosition!: IPosition | null;
	acessible!: boolean;
	pawn!: LudoPawn | null;
	home!: LudoPlayerColor | null;
	startSquare!: boolean;

	constructor(
		acessible: boolean,
		nextPosition: IPosition | null = null,
		home: LudoPlayerColor | null = null,
		startSquare: boolean = false,
		pawn: LudoPawn | null = null
	) {
		this.acessible = acessible;
		this.nextPosition = nextPosition;
		this.pawn = pawn;
		this.home = home;
		this.startSquare = startSquare;
	}
}

export const GREEN_HOME: IPosition[] = [
	{ x: 2, y: 2 },
	{ x: 3, y: 2 },
	{ x: 2, y: 3 },
	{ x: 3, y: 3 },
];

export const YELLOW_HOME: IPosition[] = [
	{ x: 11, y: 2 },
	{ x: 12, y: 2 },
	{ x: 11, y: 3 },
	{ x: 12, y: 3 },
];

export const BLUE_HOME: IPosition[] = [
	{ x: 2, y: 11 },
	{ x: 3, y: 11 },
	{ x: 2, y: 12 },
	{ x: 3, y: 12 },
];

export const RED_HOME: IPosition[] = [
	{ x: 11, y: 11 },
	{ x: 12, y: 11 },
	{ x: 11, y: 12 },
	{ x: 12, y: 12 },
];

export const newBoard: BoardSquare[][] = [
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 7, y: 0 }),
		new BoardSquare(true, { x: 8, y: 0 }, LudoPlayerColor.YELLOW),
		new BoardSquare(true, { x: 8, y: 1 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 0 }),
		new BoardSquare(true, { x: 7, y: 2 }, LudoPlayerColor.YELLOW),
		new BoardSquare(true, { x: 8, y: 2 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 0)
		),
		new BoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 1)
		),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 1 }),
		new BoardSquare(true, { x: 7, y: 3 }, LudoPlayerColor.YELLOW),
		new BoardSquare(true, { x: 8, y: 3 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 0)
		),
		new BoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 1)
		),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 2)
		),
		new BoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 3)
		),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 2 }),
		new BoardSquare(true, { x: 7, y: 4 }, LudoPlayerColor.YELLOW),
		new BoardSquare(true, { x: 8, y: 4 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 2)
		),
		new BoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 3)
		),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 3 }),
		new BoardSquare(true, { x: 7, y: 5 }, LudoPlayerColor.YELLOW),
		new BoardSquare(true, { x: 8, y: 5 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 4 }),
		new BoardSquare(true, null, LudoPlayerColor.YELLOW),
		new BoardSquare(true, { x: 8, y: 6 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(true, { x: 1, y: 6 }),
		new BoardSquare(true, { x: 2, y: 6 }),
		new BoardSquare(true, { x: 3, y: 6 }),
		new BoardSquare(true, { x: 4, y: 6 }),
		new BoardSquare(true, { x: 5, y: 6 }),
		new BoardSquare(true, { x: 6, y: 6 }),
		new BoardSquare(true, { x: 6, y: 5 }),
		new BoardSquare(false),
		new BoardSquare(true, { x: 9, y: 6 }),
		new BoardSquare(true, { x: 10, y: 6 }),
		new BoardSquare(true, { x: 11, y: 6 }),
		new BoardSquare(true, { x: 12, y: 6 }),
		new BoardSquare(true, { x: 13, y: 6 }),
		new BoardSquare(true, { x: 14, y: 6 }),
		new BoardSquare(true, { x: 14, y: 7 }),
	],
	[
		new BoardSquare(true, { x: 1, y: 7 }, LudoPlayerColor.GREEN),
		new BoardSquare(true, { x: 2, y: 7 }, LudoPlayerColor.GREEN),
		new BoardSquare(true, { x: 3, y: 7 }, LudoPlayerColor.GREEN),
		new BoardSquare(true, { x: 4, y: 7 }, LudoPlayerColor.GREEN),
		new BoardSquare(true, { x: 5, y: 7 }, LudoPlayerColor.GREEN),
		new BoardSquare(true, null, LudoPlayerColor.GREEN),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, null, LudoPlayerColor.BLUE),
		new BoardSquare(true, { x: 9, y: 7 }, LudoPlayerColor.BLUE),
		new BoardSquare(true, { x: 10, y: 7 }, LudoPlayerColor.BLUE),
		new BoardSquare(true, { x: 11, y: 7 }, LudoPlayerColor.BLUE),
		new BoardSquare(true, { x: 12, y: 7 }, LudoPlayerColor.BLUE),
		new BoardSquare(true, { x: 14, y: 8 }, LudoPlayerColor.BLUE),
	],
	[
		new BoardSquare(true, { x: 0, y: 7 }),
		new BoardSquare(true, { x: 1, y: 8 }),
		new BoardSquare(true, { x: 2, y: 8 }),
		new BoardSquare(true, { x: 3, y: 8 }),
		new BoardSquare(true, { x: 4, y: 8 }),
		new BoardSquare(true, { x: 5, y: 8 }),
		new BoardSquare(true, { x: 6, y: 8 }),
		new BoardSquare(false),
		new BoardSquare(true, { x: 8, y: 9 }),
		new BoardSquare(true, { x: 8, y: 8 }),
		new BoardSquare(true, { x: 9, y: 8 }),
		new BoardSquare(true, { x: 10, y: 8 }),
		new BoardSquare(true, { x: 11, y: 8 }),
		new BoardSquare(true, { x: 12, y: 8 }),
		new BoardSquare(true, { x: 13, y: 8 }),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 8 }),
		new BoardSquare(true, null, LudoPlayerColor.RED),
		new BoardSquare(true, { x: 8, y: 10 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 9 }),
		new BoardSquare(true, { x: 7, y: 9 }, LudoPlayerColor.RED),
		new BoardSquare(true, { x: 8, y: 11 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 0)
		),
		new BoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 1)
		),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 10 }),
		new BoardSquare(true, { x: 7, y: 10 }, LudoPlayerColor.RED),
		new BoardSquare(true, { x: 8, y: 12 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 0)
		),
		new BoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 1)
		),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 2)
		),
		new BoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 3)
		),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 11 }),
		new BoardSquare(true, { x: 7, y: 11 }, LudoPlayerColor.RED),
		new BoardSquare(true, { x: 8, y: 13 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 2)
		),
		new BoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 3)
		),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 12 }),
		new BoardSquare(true, { x: 7, y: 14 }, LudoPlayerColor.RED),
		new BoardSquare(true, { x: 8, y: 14 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
	[
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(true, { x: 6, y: 13 }),
		new BoardSquare(true, { x: 6, y: 14 }, LudoPlayerColor.RED),
		new BoardSquare(true, { x: 7, y: 14 }),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
		new BoardSquare(false),
	],
];
