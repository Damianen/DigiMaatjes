export abstract class GameDataFactory {
	abstract createServerData(data: any): IServerGameData;
	abstract createClientData(data: any): IClientGameData;
}

export interface IServerGameData {
	getData(): any;
}

export interface IClientGameData {
	getData(): any;
}
