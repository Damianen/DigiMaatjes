import { useState } from "react";

import { socket } from "../socket";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
   
    const [nicknameInput, setNicknameInput] = useState("");
    const [roomInput, setRoomInput] = useState(1); // Default room
    const router = useRouter();
    const joinRoom = () => {
        if (nicknameInput.trim()) {
            socket.emit("joinRoom", roomInput, nicknameInput); // Emit joinRoom with the room number and nickname
            router.push("/websocket"); // Redirect to the websocket page
        }
    };

    return (
        <div>
            <div>
            <input
                type="text"
                placeholder="Enter your nickname"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
            />
            </div>
            <div>
            <input
                type="number"
                placeholder="Enter room number"
                value={roomInput}
                onChange={(e) => setRoomInput(parseInt(e.target.value))}
            />
            </div>
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
}
