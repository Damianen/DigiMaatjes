import { User } from './user';

export class Message {
	message!: string;
	sender!: User;
	timeSend!: Date;
}

export class ChatLog {
	messages!: Array<Message>;
}
