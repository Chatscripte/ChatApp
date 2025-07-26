import { io } from "socket.io-client";


const socket = io('ws://localhost:3333', {
    autoConnect: false
});

export default socket;