import { IGame } from '@/lib/models/game.interface';
import { IUser } from '@/lib/models/user.interface';

export abstract class GameFactory {
	abstract createGame(users: Array<IUser>): IGame;
}
