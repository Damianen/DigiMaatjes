import { LudoPlayer, LudoPlayerColor } from '@/games/ludo/ludo.player';
import {
	IServerGameData,
	IClientGameData,
	GameDataFactory,
} from './data.interface';
import { IPosition } from './game.interface';
import { BoardSquare } from '@/games/ludo/board';

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
	constructor(board: BoardSquare[][]) {
		this.board = board;
	}

	getData() {
		return { board: this.board };
	}

	board!: BoardSquare[][];
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
