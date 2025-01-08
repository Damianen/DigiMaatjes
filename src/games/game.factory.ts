import { IGame } from '@/models/game.interface';
import { IUser } from '@/models/user.interface';

export abstract class GameFactory {
	abstract createGame(users: Array<IUser>): IGame;
}
