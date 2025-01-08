import { LudoPawn } from '@/lib/models/ludo.interface';
import { IPlayer } from '../../models/game.interface';
import { IUser } from '../../models/user.interface';

export enum LudoPlayerColor {
	BLUE = 0,
	RED = 1,
	YELLOW = 2,
	GREEN = 3,
}

export class LudoPlayer implements IPlayer {
	constructor(user: IUser, color: LudoPlayerColor) {
		this.user = user;
		this.color = color;
	}

	user!: IUser;
	color!: LudoPlayerColor;
}
