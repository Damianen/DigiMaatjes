import { IClientGameData } from '@/lib/models/data.interface';
import {
	LudoBoardSquare,
	LudoGameDataFacotry,
	LudoPawn,
	LudoServerGameData,
} from '@/lib/models/ludo.interface';
import { IGame, IPlayer, IPosition } from '../../models/game.interface';
import {
	BLUE_HOME,
	BLUE_START,
	GREEN_HOME,
	GREEN_START,
	newBoard,
	RED_HOME,
	RED_START,
	REVERSE_BLUE,
	REVERSE_GREEN,
	REVERSE_RED,
	REVERSE_YELLOW,
	YELLOW_HOME,
	YELLOW_START,
} from './board';
import { LudoPlayer, LudoPlayerColor } from './ludo.player';

export class LudoGame implements IGame {
	constructor(players: Array<IPlayer>) {
		this.players = players as LudoPlayer[];
		this.currentPlayer = this.players[0];
		this.board = newBoard;
	}

	players!: Array<LudoPlayer>;
	currentPlayer!: LudoPlayer;
	name!: string;
	description!: string;
	board!: Array<Array<LudoBoardSquare>>;

	takeTurn(data: LudoServerGameData): IClientGameData {
		const dataFactory = new LudoGameDataFacotry();

		if (!data) {
			throw new Error('Invalid data');
		}

		const pawn: LudoPawn = data.changedPawn;
		const position: IPosition = data.position;
		const diceNum: number = data.dice;

		// Check if all data is in the send data
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

		// Check if the pawn that was clicked is in the startSqaure and if the dice is not 6.
		// when this is the case give the turn to the next player.
		if (this.board[position.y][position.x].startSquare && diceNum != 6) {
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
			return dataFactory.createClientData({
				board: this.board,
				player: this.currentPlayer,
			});
		}

		let currentPosition: IPosition = position;
		let reverse: boolean = false;

		// for the amount that was rolled
		for (let i = 0; i < diceNum; i++) {
			let nextPos: IPosition = this.board[currentPosition.y][
				currentPosition.x
			].nextPosition as IPosition;

			// if the pawn is in the start square and the roll was 6
			// move the pawn to the next sqaure and break the loop
			if (
				this.board[position.y][position.x].startSquare &&
				diceNum == 6
			) {
				currentPosition = nextPos;
				break;
			}

			// if the next position is the last position of the home squares
			// or if there is a pawn in front of you in the home sqaures
			// or if you are already reversed
			// look through the reverse positions and find the next one and set the current position
			if (
				this.board[nextPos.y][nextPos.x].nextPosition == null ||
				reverse ||
				(this.board[nextPos.y][nextPos.x].home == pawn.color &&
					this.board[nextPos.y][nextPos.x].pawn != null)
			) {
				if (!reverse) {
					reverse = true;
				}

				switch (pawn.color) {
					case LudoPlayerColor.BLUE:
						for (let i = 0; i < REVERSE_BLUE.length; i++) {
							if (
								REVERSE_BLUE[i].x == currentPosition.x &&
								REVERSE_BLUE[i].y == currentPosition.y
							) {
								currentPosition = REVERSE_BLUE[i + 1];
								break;
							}
						}
						break;
					case LudoPlayerColor.YELLOW:
						for (let i = 0; i < REVERSE_YELLOW.length; i++) {
							if (
								REVERSE_YELLOW[i].x == currentPosition.x &&
								REVERSE_YELLOW[i].y == currentPosition.y
							) {
								currentPosition = REVERSE_YELLOW[i + 1];
								break;
							}
						}
						break;
					case LudoPlayerColor.GREEN:
						for (let i = 0; i < REVERSE_GREEN.length; i++) {
							if (
								REVERSE_GREEN[i].x == currentPosition.x &&
								REVERSE_GREEN[i].y == currentPosition.y
							) {
								currentPosition = REVERSE_GREEN[i + 1];
								break;
							}
						}
						break;
					case LudoPlayerColor.RED:
						for (let i = 0; i < REVERSE_RED.length; i++) {
							if (
								REVERSE_RED[i].x == currentPosition.x &&
								REVERSE_RED[i].y == currentPosition.y
							) {
								currentPosition = REVERSE_RED[i + 1];
								break;
							}
						}
						break;
				}
				continue;
			}

			// check whether the square that is next to the home squares is the home sqaures of the pawn
			// set the next position to be inside the home squares
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

			currentPosition = nextPos;
		}

		// set the start position of the pawn to null
		this.board[position.y][position.x].pawn = null;

		// check if the postion the pawn landed on has another pawn on it and set this pawn back to the home squares
		if (this.board[currentPosition.y][currentPosition.x].pawn != null) {
			const slainPawn: LudoPawn = this.board[currentPosition.y][
				currentPosition.x
			].pawn as LudoPawn;
			switch (slainPawn.color) {
				case LudoPlayerColor.BLUE:
					// check each of the home squares if there is a pawn set the pawn to one that is empty
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

		// set the pawn to the new position
		this.board[currentPosition.y][currentPosition.x].pawn = pawn;

		// check for each color if all of the pawns are in the home squares
		for (let i = 0; i < GREEN_HOME.length; i++) {
			if (this.board[GREEN_HOME[i].y][GREEN_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				return dataFactory.createClientData({
					board: this.board,
					player: this.currentPlayer,
					won: LudoPlayerColor.GREEN,
				});
			}
		}

		for (let i = 0; i < YELLOW_HOME.length; i++) {
			if (this.board[YELLOW_HOME[i].y][YELLOW_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				return dataFactory.createClientData({
					board: this.board,
					player: this.currentPlayer,
					won: LudoPlayerColor.YELLOW,
				});
			}
		}

		for (let i = 0; i < RED_HOME.length; i++) {
			if (this.board[RED_HOME[i].y][RED_HOME[i].x].pawn == null) {
				break;
			}
			if (i == 3) {
				return dataFactory.createClientData({
					board: this.board,
					player: this.currentPlayer,
					won: LudoPlayerColor.RED,
				});
			}
		}

		for (let i = 0; i < BLUE_HOME.length; i++) {
			if (this.board[BLUE_HOME[i].y][BLUE_HOME[i].x].pawn == null) {
				console.log('not won');
				break;
			}
			if (i == 3) {
				console.log('won');
				return dataFactory.createClientData({
					board: this.board,
					player: this.currentPlayer,
					won: LudoPlayerColor.BLUE,
				});
			}
		}

		// check if the dice roll is not 6 so the player can throw again
		// if not dont change the player to the next player.
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

		return dataFactory.createClientData({
			board: this.board,
			player: this.currentPlayer,
		});
	}
}
