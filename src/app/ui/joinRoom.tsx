'use client';

import { use, useEffect, useState } from "react";
import { socket } from "../socket";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
    const router = useRouter();
    const joinRoom = () => {
        socket.emit("joinRoom", 1);
       router.push("/websocket")
    }

    return (
        <div>
        <button onClick={joinRoom}>Join Room</button>
        </div>
    );
    }