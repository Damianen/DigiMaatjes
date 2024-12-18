import { IChatLog } from './chat.interface';

export interface IUser {
	email: string;
	firstName: string;
	lastName: string;
	userName: string;
	password: string;
	birthdate: Date;
	profileImages: ImageBitmap;
	friendsList: Array<IUser>;
}

export interface IFriendship {
	user1: IUser;
	user2: IUser;
	chatLog: IChatLog;
}

export interface IFriendRequest {
	sender: IUser;
	receiver: IUser;
}
