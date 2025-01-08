import { LudoPawn } from '@/models/ludo.interface';
import { IPlayer } from '../../models/game.interface';
import { IUser } from '../../models/user.interface';

export enum LudoPlayerColor {
	BLUE = 'Blauw',
	RED = 'Rood',
	YELLOW = 'Geel',
	GREEN = 'Groen',
	NULL = 'null',
}

export class LudoPlayer implements IPlayer {
	constructor(user: string, color: LudoPlayerColor) {
		this.user = user;
		this.color = color;
	}

	user!: string;
	color!: LudoPlayerColor;
}
