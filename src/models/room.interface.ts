import { IChatLog } from './chat.interface';
import { IGame } from './game.interface';
import { IUser } from './user.interface';

export interface IRoom {
	roomChat: IChatLog;
	game: IGame;
	users: Array<IUser>;
}
