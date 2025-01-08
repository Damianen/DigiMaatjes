import { IClientGameData, IServerGameData } from './data.interface';
import { IUser } from './user.interface';

export interface IGameInfo {
	name: string;
	description: string;
}

export interface IGame extends IGameInfo {
	takeTurn(data: IServerGameData): IClientGameData;

	players: Array<IPlayer>;
	currentPlayer: IPlayer;
}

export interface IPlayer {
	user: IUser;
}

export interface IPosition {
	x: number;
	y: number;
}
