import { LudoPlayer, LudoPlayerColor } from '@/games/ludo/ludo.player';
import {
	IServerGameData,
	IClientGameData,
	GameDataFactory,
} from './data.interface';
import { IPosition } from './game.interface';

export class LudoGameDataFacotry implements GameDataFactory {
	createServerData(data: any): IServerGameData {
		return new LudoServerGameData(
			data.dice,
			data.playerPositions,
			data.position
		);
	}

	createClientData(data: any): IClientGameData {
		return new LudoClientGameData(data);
	}
}

export class LudoClientGameData implements IClientGameData {
	constructor(board: LudoBoardSquare[][]) {
		this.board = board;
	}

	getData() {
		return { board: this.board };
	}

	board!: LudoBoardSquare[][];
}

export class LudoBoardSquare {
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

export class LudoServerGameData implements IServerGameData {
	constructor(dice: number, changedPawn: LudoPawn, position: IPosition) {
		this.dice = dice;
		this.changedPawn = changedPawn;
		this.position = position;
	}

	getData() {
		return {
			dice: this.dice,
			changedPawn: this.changedPawn,
			position: this.position,
		};
	}

	dice!: number;
	changedPawn!: LudoPawn;
	position!: IPosition;
}

export class LudoPawn {
	constructor(color: LudoPlayerColor, id: number) {
		this.color = color;
		this.id = id;
	}

	color!: LudoPlayerColor;
	id!: number;
}
