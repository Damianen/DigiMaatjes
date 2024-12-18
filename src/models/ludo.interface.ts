import { LudoPlayer, LudoPlayerColor } from '@/games/ludo/ludo.player';
import {
	IServerGameData,
	IClientGameData,
	GameDataFactory,
} from './data.interface';
import { IPosition } from './game.interface';

export class LudoGameDataFacotry implements GameDataFactory {
	createServerData(data: any): IServerGameData {
		return new LudoServerGameData(data.dice, data.playerPositions);
	}

	createClientData(data: any): IClientGameData {
		return new LudoClientGameData(data.dice, data.id, data.player);
	}
}

export class LudoClientGameData implements IClientGameData {
	constructor(dice: number, id: number, player: LudoPlayer) {
		this.dice = dice;
		this.id = id;
		this.player = player;
	}

	getData() {
		this.data = { dice: this.dice, id: this.id, player: this.player };
		return this.data;
	}

	data: any;
	dice!: number;
	id!: number;
	player!: LudoPlayer;
}

export class LudoServerGameData implements IServerGameData {
	constructor(dice: number, changedPlayerPosition: LudoPawn) {
		this.dice = dice;
		this.changedPlayerPosition = changedPlayerPosition;
	}

	getData() {
		throw new Error('Method not implemented.');
	}

	data: any;
	dice!: number;
	changedPlayerPosition!: LudoPawn;
}

export class LudoPawn {
	constructor(color: LudoPlayerColor, id: number) {
		this.color = color;
		this.id = id;
	}

	screenPosition!: IPosition;
	color!: LudoPlayerColor;
	id!: number;
}
