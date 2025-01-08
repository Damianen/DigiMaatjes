import { IGame } from '../../models/game.interface';
import { LudoGame } from './ludo';
import { IUser } from '../../models/user.interface';
import { GameFactory } from '../game.factory';
import { IServerGameData } from '@/lib/models/data.interface';

export class LudoGameFactory extends GameFactory {
	createGame(users: Array<IUser>): IGame {
		return new LudoGame(users);
	}
}
