import { IPosition } from '@/lib/models/game.interface';
import { LudoBoardSquare, LudoPawn } from '@/lib/models/ludo.interface';
import { LudoPlayerColor } from './ludo.player';

// The positions when a pawn needs to walk backwards for each color
export const REVERSE_GREEN: IPosition[] = [
	{ x: 4, y: 7 },
	{ x: 3, y: 7 },
	{ x: 2, y: 7 },
	{ x: 1, y: 7 },
	{ x: 0, y: 7 },
	{ x: 0, y: 8 },
	{ x: 1, y: 8 },
	{ x: 2, y: 8 },
	{ x: 3, y: 8 },
];

export const REVERSE_YELLOW: IPosition[] = [
	{ y: 4, x: 7 },
	{ y: 3, x: 7 },
	{ y: 2, x: 7 },
	{ y: 1, x: 7 },
	{ y: 0, x: 7 },
	{ y: 0, x: 8 },
	{ y: 1, x: 8 },
	{ y: 2, x: 8 },
	{ y: 3, x: 8 },
];

export const REVERSE_BLUE: IPosition[] = [
	{ x: 10, y: 7 },
	{ x: 11, y: 7 },
	{ x: 12, y: 7 },
	{ x: 13, y: 7 },
	{ x: 14, y: 7 },
	{ x: 14, y: 6 },
	{ x: 13, y: 6 },
	{ x: 12, y: 6 },
	{ x: 11, y: 6 },
];

export const REVERSE_RED: IPosition[] = [
	{ y: 10, x: 7 },
	{ y: 11, x: 7 },
	{ y: 12, x: 7 },
	{ y: 13, x: 7 },
	{ y: 14, x: 7 },
	{ y: 14, x: 6 },
	{ y: 13, x: 6 },
	{ y: 12, x: 6 },
	{ y: 11, x: 6 },
];

// the start positions fot all colors
export const GREEN_START: IPosition[] = [
	{ x: 2, y: 2 },
	{ x: 3, y: 2 },
	{ x: 2, y: 3 },
	{ x: 3, y: 3 },
];

export const YELLOW_START: IPosition[] = [
	{ x: 11, y: 2 },
	{ x: 12, y: 2 },
	{ x: 11, y: 3 },
	{ x: 12, y: 3 },
];

export const RED_START: IPosition[] = [
	{ x: 2, y: 11 },
	{ x: 3, y: 11 },
	{ x: 2, y: 12 },
	{ x: 3, y: 12 },
];

export const BLUE_START: IPosition[] = [
	{ x: 11, y: 11 },
	{ x: 12, y: 11 },
	{ x: 11, y: 12 },
	{ x: 12, y: 12 },
];

// the home positions of all colors
export const GREEN_HOME: IPosition[] = [
	{ x: 1, y: 7 },
	{ x: 2, y: 7 },
	{ x: 3, y: 7 },
	{ x: 4, y: 7 },
];
export const YELLOW_HOME: IPosition[] = [
	{ x: 7, y: 1 },
	{ x: 7, y: 2 },
	{ x: 7, y: 3 },
	{ x: 7, y: 4 },
];
export const RED_HOME: IPosition[] = [
	{ x: 7, y: 10 },
	{ x: 7, y: 11 },
	{ x: 7, y: 12 },
	{ x: 7, y: 13 },
];
export const BLUE_HOME: IPosition[] = [
	{ x: 10, y: 7 },
	{ x: 11, y: 7 },
	{ x: 12, y: 7 },
	{ x: 13, y: 7 },
];

export function getHomePosition(color: LudoPlayerColor): IPosition[] {
	if (LudoPlayerColor.BLUE == color) {
		return BLUE_HOME;
	} else if (LudoPlayerColor.RED == color) {
		return RED_HOME;
	} else if (LudoPlayerColor.YELLOW == color) {
		return YELLOW_HOME;
	} else {
		return GREEN_HOME;
	}
}

// the start board of the ludo game whith the folling attributes:
// Weather the sqaure is accessible
// The next position
// The home positions color
// Weather the square is accesible
// The pawn that is in that square if there is no pawn its null
export const newBoard: LudoBoardSquare[][] = [
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 7, y: 0 }),
		new LudoBoardSquare(true, { x: 8, y: 0 }, LudoPlayerColor.YELLOW),
		new LudoBoardSquare(true, { x: 8, y: 1 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 0 }),
		new LudoBoardSquare(true, { x: 7, y: 2 }, LudoPlayerColor.YELLOW),
		new LudoBoardSquare(true, { x: 8, y: 2 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 0)
		),
		new LudoBoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 1)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 1 }),
		new LudoBoardSquare(true, { x: 7, y: 3 }, LudoPlayerColor.YELLOW),
		new LudoBoardSquare(true, { x: 8, y: 3 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 0)
		),
		new LudoBoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 1)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 2)
		),
		new LudoBoardSquare(
			true,
			{ x: 1, y: 6 },
			LudoPlayerColor.GREEN,
			true,
			new LudoPawn(LudoPlayerColor.GREEN, 3)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 2 }),
		new LudoBoardSquare(true, { x: 7, y: 4 }, LudoPlayerColor.YELLOW),
		new LudoBoardSquare(true, { x: 8, y: 4 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 2)
		),
		new LudoBoardSquare(
			true,
			{ x: 8, y: 1 },
			LudoPlayerColor.YELLOW,
			true,
			new LudoPawn(LudoPlayerColor.YELLOW, 3)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 3 }),
		new LudoBoardSquare(true, { x: 7, y: 5 }, LudoPlayerColor.YELLOW),
		new LudoBoardSquare(true, { x: 8, y: 5 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 4 }),
		new LudoBoardSquare(true, null, LudoPlayerColor.YELLOW),
		new LudoBoardSquare(true, { x: 8, y: 6 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(true, { x: 1, y: 6 }),
		new LudoBoardSquare(true, { x: 2, y: 6 }),
		new LudoBoardSquare(true, { x: 3, y: 6 }),
		new LudoBoardSquare(true, { x: 4, y: 6 }),
		new LudoBoardSquare(true, { x: 5, y: 6 }),
		new LudoBoardSquare(true, { x: 6, y: 6 }),
		new LudoBoardSquare(true, { x: 6, y: 5 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 9, y: 6 }),
		new LudoBoardSquare(true, { x: 10, y: 6 }),
		new LudoBoardSquare(true, { x: 11, y: 6 }),
		new LudoBoardSquare(true, { x: 12, y: 6 }),
		new LudoBoardSquare(true, { x: 13, y: 6 }),
		new LudoBoardSquare(true, { x: 14, y: 6 }),
		new LudoBoardSquare(true, { x: 14, y: 7 }),
	],
	[
		new LudoBoardSquare(true, { x: 0, y: 6 }, LudoPlayerColor.GREEN),
		new LudoBoardSquare(true, { x: 2, y: 7 }, LudoPlayerColor.GREEN),
		new LudoBoardSquare(true, { x: 3, y: 7 }, LudoPlayerColor.GREEN),
		new LudoBoardSquare(true, { x: 4, y: 7 }, LudoPlayerColor.GREEN),
		new LudoBoardSquare(true, { x: 5, y: 7 }, LudoPlayerColor.GREEN),
		new LudoBoardSquare(true, null, LudoPlayerColor.GREEN),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, null, LudoPlayerColor.BLUE),
		new LudoBoardSquare(true, { x: 9, y: 7 }, LudoPlayerColor.BLUE),
		new LudoBoardSquare(true, { x: 10, y: 7 }, LudoPlayerColor.BLUE),
		new LudoBoardSquare(true, { x: 11, y: 7 }, LudoPlayerColor.BLUE),
		new LudoBoardSquare(true, { x: 12, y: 7 }, LudoPlayerColor.BLUE),
		new LudoBoardSquare(true, { x: 14, y: 8 }, LudoPlayerColor.BLUE),
	],
	[
		new LudoBoardSquare(true, { x: 0, y: 7 }),
		new LudoBoardSquare(true, { x: 0, y: 8 }),
		new LudoBoardSquare(true, { x: 1, y: 8 }),
		new LudoBoardSquare(true, { x: 2, y: 8 }),
		new LudoBoardSquare(true, { x: 3, y: 8 }),
		new LudoBoardSquare(true, { x: 4, y: 8 }),
		new LudoBoardSquare(true, { x: 5, y: 8 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 8, y: 9 }),
		new LudoBoardSquare(true, { x: 8, y: 8 }),
		new LudoBoardSquare(true, { x: 9, y: 8 }),
		new LudoBoardSquare(true, { x: 10, y: 8 }),
		new LudoBoardSquare(true, { x: 11, y: 8 }),
		new LudoBoardSquare(true, { x: 12, y: 8 }),
		new LudoBoardSquare(true, { x: 13, y: 8 }),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 8 }),
		new LudoBoardSquare(true, null, LudoPlayerColor.RED),
		new LudoBoardSquare(true, { x: 8, y: 10 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 9 }),
		new LudoBoardSquare(true, { x: 7, y: 9 }, LudoPlayerColor.RED),
		new LudoBoardSquare(true, { x: 8, y: 11 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 0)
		),
		new LudoBoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 1)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 10 }),
		new LudoBoardSquare(true, { x: 7, y: 10 }, LudoPlayerColor.RED),
		new LudoBoardSquare(true, { x: 8, y: 12 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 0)
		),
		new LudoBoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 1)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 2)
		),
		new LudoBoardSquare(
			true,
			{ x: 6, y: 13 },
			LudoPlayerColor.RED,
			true,
			new LudoPawn(LudoPlayerColor.RED, 3)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 11 }),
		new LudoBoardSquare(true, { x: 7, y: 11 }, LudoPlayerColor.RED),
		new LudoBoardSquare(true, { x: 8, y: 13 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 2)
		),
		new LudoBoardSquare(
			true,
			{ x: 13, y: 8 },
			LudoPlayerColor.BLUE,
			true,
			new LudoPawn(LudoPlayerColor.BLUE, 3)
		),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 12 }),
		new LudoBoardSquare(true, { x: 7, y: 12 }, LudoPlayerColor.RED),
		new LudoBoardSquare(true, { x: 8, y: 14 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
	[
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(true, { x: 6, y: 13 }),
		new LudoBoardSquare(true, { x: 6, y: 14 }, LudoPlayerColor.RED),
		new LudoBoardSquare(true, { x: 7, y: 14 }),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
		new LudoBoardSquare(false),
	],
];
