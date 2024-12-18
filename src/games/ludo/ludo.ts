import {
	LudoClientGameData,
	LudoGameDataFacotry,
	LudoPawn,
} from '@/models/ludo.interface';
import { IPlayer, IGame } from '../../models/game.interface';
import { IUser } from '../../models/user.interface';
import { LudoPlayer } from './ludo.player';
import { IClientGameData, IServerGameData } from '@/models/data.interface';

export class LudoGame implements IGame {
	constructor(users: Array<IUser>) {
		this.players = [];
		let i = 0;
		users.forEach((user) => {
			let player: IPlayer = new LudoPlayer(user, i);
			this.players.push(player);
			i++;
		});
		this.currentPlayer = this.players[0];
	}

	takeTurn(data: IServerGameData): IClientGameData {
		return this.dataFactory.createClientData({});
	}

	players!: Array<IPlayer>;
	currentPlayer!: IPlayer;
	name!: string;
	description!: string;
	dataFactory!: LudoGameDataFacotry;
	board!: Array<Array<boardSquare>>;
}

class boardSquare {
	nextPosition!: Location | null;
	acessible!: boolean;
	pawn!: LudoPawn | null;
}

const board = [
	[
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },

		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },

		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
	],
	[
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },

		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },

		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
		{ nextPosition: null, acesible: false, pawn: null },
	],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
];
