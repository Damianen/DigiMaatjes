import { IUser } from './user.interface';

export interface IMessage {
	message: string;
	sender: IUser;
	timeSend: Date;
}

export interface IChatLog {
	messages: Array<IMessage>;
}
