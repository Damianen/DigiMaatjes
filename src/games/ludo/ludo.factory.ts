import { IGame, IPlayer } from '../../models/game.interface';
import { LudoGame } from './ludo';
import { IUser } from '../../models/user.interface';
import { GameFactory } from '../game.factory';
import { IServerGameData } from '@/models/data.interface';

export class LudoGameFactory extends GameFactory {
	createGame(users: Array<IPlayer>): IGame {
		return new LudoGame(users);
	}
}
