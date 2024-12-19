import {
	LudoBoardSquare,
	LudoClientGameData,
	LudoGameDataFacotry,
	LudoPawn,
} from '@/models/ludo.interface';
import { IPlayer, IGame, IPosition } from '../../models/game.interface';
import { IUser } from '../../models/user.interface';
import { LudoPlayer, LudoPlayerColor } from './ludo.player';
import { IClientGameData, IServerGameData } from '@/models/data.interface';
import {
	newBoard,
	BLUE_HOME,
	YELLOW_HOME,
	RED_HOME,
	GREEN_HOME,
} from './board';

export class LudoGame implements IGame {
	constructor(users: Array<IUser>) {
		this.players = [];
		let i = 0;
		users.forEach((user) => {
			let player: LudoPlayer = new LudoPlayer(user, i);
			this.players.push(player);
			i++;
		});
		this.currentPlayer = this.players[0];
		this.board = newBoard;
	}

	players!: Array<LudoPlayer>;
	currentPlayer!: LudoPlayer;
	name!: string;
	description!: string;
	dataFactory!: LudoGameDataFacotry;
	board!: Array<Array<LudoBoardSquare>>;

	takeTurn(data: IServerGameData): IClientGameData {
		if (!data) {
			throw new Error('Invalid data');
		}

		const pawn: LudoPawn = data.getData().changedPawn;
		const position: IPosition = data.getData().position;
		const diceNum: number = data.getData().dice;
		if (
			!pawn ||
			!diceNum ||
			!position ||
			pawn != this.board[position.y][position.x].pawn
		) {
			throw new Error('Invalid data');
		}

		if (pawn.color != this.currentPlayer.color) {
			throw new Error('Not Your turn!');
		}

		if (this.board[position.y][position.x].startSquare && diceNum != 6) {
			throw new Error('Je hebt geen 6 gegooit!');
		}

		let currentPosition: IPosition = position;

		for (let i = 0; i < diceNum; i++) {
			let nextPos: IPosition = this.board[currentPosition.y][
				currentPosition.x
			].nextPosition as IPosition;

			if (
				this.board[position.y][position.x].startSquare &&
				diceNum == 6
			) {
				currentPosition = nextPos;
				break;
			}

			if (this.board[nextPos.y][nextPos.x].nextPosition == null) {
				break;
			}

			if (
				this.board[nextPos.y][nextPos.x].home == pawn.color &&
				this.board[
					(this.board[nextPos.y][nextPos.x].nextPosition as IPosition)
						.x
				][
					(this.board[nextPos.y][nextPos.x].nextPosition as IPosition)
						.y
				].home != pawn.color
			) {
				switch (pawn.color) {
					case LudoPlayerColor.BLUE:
						nextPos = { x: 13, y: 7 };
						break;
					case LudoPlayerColor.YELLOW:
						nextPos = { x: 7, y: 1 };
						break;
					case LudoPlayerColor.RED:
						nextPos = { x: 1, y: 7 };
						break;
					case LudoPlayerColor.GREEN:
						nextPos = { x: 7, y: 13 };
						break;
				}
			}

			if (
				this.board[nextPos.y][nextPos.x].home == pawn.color &&
				this.board[nextPos.y][nextPos.x].pawn != null
			) {
				break;
			}

			currentPosition = nextPos;
		}

		this.board[position.y][position.x].pawn = null;

		if (this.board[currentPosition.y][currentPosition.x].pawn != null) {
			const slainPawn: LudoPawn = this.board[currentPosition.y][
				currentPosition.x
			].pawn as LudoPawn;
			switch (slainPawn.color) {
				case LudoPlayerColor.BLUE:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[BLUE_HOME[i].y][BLUE_HOME[i].x].pawn ==
							null
						) {
							this.board[BLUE_HOME[i].y][BLUE_HOME[i].x].pawn =
								slainPawn;
						}
					}
					break;
				case LudoPlayerColor.YELLOW:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[YELLOW_HOME[i].y][YELLOW_HOME[i].x]
								.pawn == null
						) {
							this.board[YELLOW_HOME[i].y][
								YELLOW_HOME[i].x
							].pawn = slainPawn;
						}
					}
					break;
				case LudoPlayerColor.RED:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[RED_HOME[i].y][RED_HOME[i].x].pawn ==
							null
						) {
							this.board[RED_HOME[i].y][RED_HOME[i].x].pawn =
								slainPawn;
						}
					}
					break;
				case LudoPlayerColor.GREEN:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[GREEN_HOME[i].y][GREEN_HOME[i].x].pawn ==
							null
						) {
							this.board[GREEN_HOME[i].y][GREEN_HOME[i].x].pawn =
								slainPawn;
						}
					}
					break;
			}
		}

		this.board[currentPosition.y][currentPosition.x].pawn = pawn;

		if (diceNum != 6) {
			if (
				this.players.indexOf(this.currentPlayer) ==
				this.players.length - 1
			) {
				this.currentPlayer = this.players[0];
			} else {
				this.currentPlayer =
					this.players[this.players.indexOf(this.currentPlayer) + 1];
			}
		}

		return this.dataFactory.createClientData(this.board);
	}
}
