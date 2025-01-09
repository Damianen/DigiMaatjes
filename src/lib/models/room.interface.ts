import { IChatLog } from './chat.interface';
import { IGame, IPlayer } from './game.interface';

export interface IRoom {
	roomChat: IChatLog;
	game: IGame;
	owner: IPlayer
	users: Array<IPlayer>;
}
