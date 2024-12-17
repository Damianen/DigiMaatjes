import { ChatLog } from './chat';

export class User {
	constructor() {}

	email!: string;
	firstName!: string;
	lastName!: string;
	userName!: string;
	private password!: string;
	birthdate!: Date;
	profileImages!: ImageBitmap;
	friendsList!: Array<User>;
}

export class Friendship {
	user1!: User;
	user2!: User;
	chatLog!: ChatLog;
}

export class FriendRequest {
	sender!: User;
	receiver!: User;
}
