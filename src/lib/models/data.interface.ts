export abstract class GameDataFactory {
	abstract createServerData(data: object): IServerGameData;
	abstract createClientData(data: object): IClientGameData;
}

export interface IServerGameData {
	getData(): any;
}

export interface IClientGameData {
	getData(): any;
}
