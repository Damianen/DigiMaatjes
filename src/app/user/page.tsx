'use client'

import JoinRoom from '../ui/joinRoom';
import User from './user';
import { socket } from "../socket";

export default function Home() {


	return (
		<>
			<div>Hello user!</div>
			<JoinRoom></JoinRoom>
		</>
	);
}
