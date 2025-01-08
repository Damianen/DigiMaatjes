import { IGame, IPlayer } from '@/models/game.interface';
import { IUser } from '@/models/user.interface';

export abstract class GameFactory {
	abstract createGame(users: Array<IPlayer>): IGame;
}
