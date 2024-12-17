import { Player } from '../game';
import { User } from '../user';

export enum LudoPlayerColor {
	BLUE,
	RED,
	YELLOW,
	GREEN,
}

export class LudoPlayer implements Player {
	constructor(user: User) {
		this.user = user;
	}

	user!: User;
	color!: LudoPlayerColor;
}
