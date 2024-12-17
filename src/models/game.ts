import { User } from './user';

export abstract class GameFactory {
	protected game?: IGame;

	protected abstract createGame(data: IGameData): IGame;

	takeTurn(data: IGameData): IGameData {
		if (!this.game) {
			this.game = this.createGame(data);
		}
		return this.game.takeTurn();
	}
}

export interface IGameInfo {
	name: string;
	description: string;
}

export interface IGame {
	takeTurn(): IGameData;

	players: Array<Player>;
	currentUser: Player;
}

export abstract class GameDataFactory {
	abstract CreateGameData(): IGameData;
}

export interface IGameData {
	GetGameData(): any;
}

export abstract class Player {
	abstract createPlayer(user: User): Player;

	user!: User;
}

export interface Position {
	x: number;
	y: number;
}
