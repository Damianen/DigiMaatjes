import {
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
	BoardSquare,
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
	board!: Array<Array<BoardSquare>>;

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
			pawn != this.board[position.x][position.y].pawn
		) {
			throw new Error('Invalid data');
		}

		if (pawn.color != this.currentPlayer.color) {
			throw new Error('Not Your turn!');
		}

		if (this.board[position.x][position.y].home && diceNum != 6) {
			throw new Error('Je hebt geen 6 gegooit!');
		}

		let currentPosition: IPosition = position;

		for (let i = 0; i < diceNum; i++) {
			let nextPos: IPosition = this.board[currentPosition.x][
				currentPosition.y
			].nextPosition as IPosition;

			if (this.board[position.x][position.y].home && diceNum == 6) {
				currentPosition = nextPos;
				break;
			}

			if (this.board[nextPos.x][nextPos.y].nextPosition == null) {
				break;
			}

			if (
				this.board[nextPos.x][nextPos.y].home == pawn.color &&
				this.board[
					(this.board[nextPos.x][nextPos.y].nextPosition as IPosition)
						.x
				][
					(this.board[nextPos.x][nextPos.y].nextPosition as IPosition)
						.y
				].home != pawn.color
			) {
				switch (pawn.color) {
					case LudoPlayerColor.BLUE:
						nextPos = { x: 13, y: 7 };
					case LudoPlayerColor.YELLOW:
						nextPos = { x: 7, y: 1 };
					case LudoPlayerColor.RED:
						nextPos = { x: 1, y: 7 };
					case LudoPlayerColor.GREEN:
						nextPos = { x: 7, y: 13 };
				}
			}

			if (
				this.board[nextPos.x][nextPos.y].home == pawn.color &&
				this.board[nextPos.x][nextPos.y].pawn != null
			) {
				break;
			}

			currentPosition = nextPos;
		}

		this.board[position.x][position.y].pawn = null;

		if (this.board[currentPosition.x][currentPosition.y].pawn != null) {
			const slainPawn: LudoPawn = this.board[currentPosition.x][
				currentPosition.y
			].pawn as LudoPawn;
			switch (slainPawn.color) {
				case LudoPlayerColor.BLUE:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[BLUE_HOME[i].x][BLUE_HOME[i].y].pawn ==
							null
						) {
							this.board[BLUE_HOME[i].x][BLUE_HOME[i].y].pawn =
								slainPawn;
						}
					}
				case LudoPlayerColor.YELLOW:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[YELLOW_HOME[i].x][YELLOW_HOME[i].y]
								.pawn == null
						) {
							this.board[YELLOW_HOME[i].x][
								YELLOW_HOME[i].y
							].pawn = slainPawn;
						}
					}
				case LudoPlayerColor.RED:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[RED_HOME[i].x][RED_HOME[i].y].pawn ==
							null
						) {
							this.board[RED_HOME[i].x][RED_HOME[i].y].pawn =
								slainPawn;
						}
					}
				case LudoPlayerColor.GREEN:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[GREEN_HOME[i].x][GREEN_HOME[i].y].pawn ==
							null
						) {
							this.board[GREEN_HOME[i].x][GREEN_HOME[i].y].pawn =
								slainPawn;
						}
					}
			}
		}

		this.board[currentPosition.x][currentPosition.y].pawn = pawn;

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
