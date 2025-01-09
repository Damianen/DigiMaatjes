import { IGame, IPlayer } from '@/lib/models/game.interface';

export abstract class GameFactory {
	abstract createGame(users: Array<IPlayer>): IGame;
}
