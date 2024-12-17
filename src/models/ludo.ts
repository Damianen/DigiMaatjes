import { Player, GameFactory, IGame, IGameData } from './game';
import { User } from './user';

export class LudoGameFactory extends GameFactory {
	protected createGame(data: IGameData): IGame {
		const users: Array<User> = data.GetGameData().users;
		const game = new LudoGame(users);
		return game;
	}
}

export class LudoGame implements IGame {
	constructor(users: Array<User>) {
		this.players = [];
		users.forEach((user) => {
			let player: Player = new LudoPlayer();
			this.players.push(player);
		});
		this.currentUser = this.players[0];
	}

	takeTurn(): IGameData {
		return new LudoGameData();
	}

	players!: Array<Player>;
	currentUser!: Player;
	name!: string;
	description!: string;
}

export class LudoPlayer implements Player {
	constructor() {}

	createPlayer(user: User): Player {
		let player = new LudoPlayer();
		player.user = user;
		return player;
	}

	user!: User;
}

export class LudoGameData implements IGameData {
	constructor() {}

	GetGameData() {
		return this.data;
	}

	data!: any;
}
