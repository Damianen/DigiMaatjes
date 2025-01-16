import { LudoPlayer, LudoPlayerColor } from '@/lib/games/ludo/ludo.player';
import {
	GameDataFactory,
	IClientGameData,
	IServerGameData,
} from './data.interface';
import { IPosition } from './game.interface';

export class LudoGameDataFacotry implements GameDataFactory {
	createServerData(data: any): LudoServerGameData {
		return new LudoServerGameData(data.dice, data.pawn, data.position);
	}

	createClientData(data: any): LudoClientGameData {
		return new LudoClientGameData(data.board, data.player, data.won);
	}
}

export class LudoClientGameData implements IClientGameData {
	constructor(
		board: LudoBoardSquare[][],
		player: LudoPlayer,
		won: LudoPlayerColor | null = null
	) {
		this.board = board;
		this.player = player;
		this.won = won;
	}

	getData() {
		return { board: this.board, player: this.player };
	}

	board!: LudoBoardSquare[][];
	player!: LudoPlayer;
	won!: LudoPlayerColor | null;
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

	getData(): { dice: number; changedPawn: LudoPawn; position: IPosition } {
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
