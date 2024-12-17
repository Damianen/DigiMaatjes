import { GameFactory, IGameData, IGame } from '../game';
import { LudoGame } from './ludo.class';
import { User } from '../user';

export class LudoGameFactory extends GameFactory {
	protected createGame(data: IGameData): IGame {
		const users: Array<User> = data.GetGameData().users;
		const game = new LudoGame(users);
		return game;
	}
}
