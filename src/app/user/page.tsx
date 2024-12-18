'use client'

import JoinRoom from '../ui/joinRoom';
import User from './user';

export default function Home() {


	return (
		<>
			<div>Hello user!</div>
			<User></User>
			<JoinRoom></JoinRoom>
		</>
	);
}
