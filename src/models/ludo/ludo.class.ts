import { Player, GameFactory, IGame, IGameData } from '../game';
import { User } from '../user';
import { LudoGameDataServer } from './ludo.data';
import { LudoPlayer } from './ludo.player';

export class LudoGame implements IGame {
	constructor(users: Array<User>) {
		this.players = [];
		users.forEach((user) => {
			let player: Player = new LudoPlayer(user);
			this.players.push(player);
		});
		this.currentPlayer = this.players[0];
	}

	takeTurn(): IGameData {
		return new LudoGameDataServer();
	}

	players!: Array<Player>;
	currentPlayer!: Player;
	name!: string;
	description!: string;
}
