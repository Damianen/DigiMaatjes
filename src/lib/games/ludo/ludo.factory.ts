import { IGame, IPlayer } from '../../models/game.interface';
import { GameFactory } from '../game.factory';
import { LudoGame } from './ludo';

export class LudoGameFactory extends GameFactory {
	createGame(users: Array<IPlayer>): IGame {
		return new LudoGame(users);
	}
}
