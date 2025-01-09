import {
	LudoBoardSquare,
	LudoClientGameData,
	LudoGameDataFacotry,
	LudoPawn,
	LudoServerGameData,
} from '@/models/ludo.interface';
import { IPlayer, IGame, IPosition } from '../../models/game.interface';
import { IUser } from '../../models/user.interface';
import { LudoPlayer, LudoPlayerColor } from './ludo.player';
import { IClientGameData, IServerGameData } from '@/lib/models/data.interface';
import {
	newBoard,
	BLUE_START,
	YELLOW_START,
	RED_START,
	GREEN_START,
	GREEN_HOME,
	YELLOW_HOME,
	RED_HOME,
	BLUE_HOME,
} from './board';

export class LudoGame implements IGame {
	constructor(players: Array<IPlayer>) {
		this.players = players as LudoPlayer[];
		this.currentPlayer = this.players[0];
		this.board = newBoard;
		this.dataFactory = new LudoGameDataFacotry();
	}

	players!: Array<LudoPlayer>;
	currentPlayer!: LudoPlayer;
	name!: string;
	description!: string;
	dataFactory!: LudoGameDataFacotry;
	board!: Array<Array<LudoBoardSquare>>;

	takeTurn(data: LudoServerGameData): IClientGameData {
		if (!data) {
			throw new Error('Invalid data');
		}

		const pawn: LudoPawn = data.changedPawn;
		const position: IPosition = data.position;
		const diceNum: number = data.dice;

		if (
			!pawn ||
			!diceNum ||
			!position ||
			pawn.id != this.board[position.y][position.x].pawn!.id ||
			pawn.color != this.board[position.y][position.x].pawn!.color
		) {
			throw new Error('Invalid data');
		}

		if (pawn.color != this.currentPlayer.color) {
			throw new Error('Not Your turn!');
		}

		if (this.board[position.y][position.x].startSquare && diceNum != 6) {
			//throw new Error('Je hebt geen 6 gegooit!');

			if (diceNum != 6) {
				if (
					this.players.indexOf(this.currentPlayer) ==
					this.players.length - 1
				) {
					this.currentPlayer = this.players[0];
				} else {
					this.currentPlayer =
						this.players[
							this.players.indexOf(this.currentPlayer) + 1
						];
				}
			}
			return this.dataFactory.createClientData({
				board: this.board,
				player: this.currentPlayer,
			});
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
				this.board[currentPosition.y][currentPosition.x].home ==
					pawn.color &&
				this.board[nextPos.y][nextPos.x].home != pawn.color
			) {
				switch (pawn.color) {
					case LudoPlayerColor.BLUE:
						nextPos = { x: 13, y: 7 };
						break;
					case LudoPlayerColor.YELLOW:
						nextPos = { x: 7, y: 1 };
						break;
					case LudoPlayerColor.GREEN:
						nextPos = { x: 1, y: 7 };
						break;
					case LudoPlayerColor.RED:
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
							this.board[BLUE_START[i].y][BLUE_START[i].x].pawn ==
							null
						) {
							this.board[BLUE_START[i].y][BLUE_START[i].x].pawn =
								slainPawn;
							break;
						}
					}
					break;
				case LudoPlayerColor.YELLOW:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[YELLOW_START[i].y][YELLOW_START[i].x]
								.pawn == null
						) {
							this.board[YELLOW_START[i].y][
								YELLOW_START[i].x
							].pawn = slainPawn;
							break;
						}
					}
					break;
				case LudoPlayerColor.RED:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[RED_START[i].y][RED_START[i].x].pawn ==
							null
						) {
							this.board[RED_START[i].y][RED_START[i].x].pawn =
								slainPawn;
							break;
						}
					}
					break;
				case LudoPlayerColor.GREEN:
					for (let i = 0; i < 4; i++) {
						if (
							this.board[GREEN_START[i].y][GREEN_START[i].x]
								.pawn == null
						) {
							this.board[GREEN_START[i].y][
								GREEN_START[i].x
							].pawn = slainPawn;
							break;
						}
					}
					break;
			}
		}

		this.board[currentPosition.y][currentPosition.x].pawn = pawn;

		for (let i = 0; i < GREEN_HOME.length; i++) {
			if (this.board[GREEN_HOME[i].y][GREEN_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				// win condition
			}
		}

		for (let i = 0; i < YELLOW_HOME.length; i++) {
			if (this.board[YELLOW_HOME[i].y][YELLOW_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				// win condition
			}
		}

		for (let i = 0; i < RED_HOME.length; i++) {
			if (this.board[RED_HOME[i].y][RED_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				// win condition
			}
		}

		for (let i = 0; i < BLUE_HOME.length; i++) {
			if (this.board[BLUE_HOME[i].y][BLUE_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				// win condition
			}
		}

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

		return this.dataFactory.createClientData({
			board: this.board,
			player: this.currentPlayer,
		});
	}
}
