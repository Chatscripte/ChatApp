import { io } from "socket.io-client";
import { getCookie } from "./helper";


const socket = io('ws://localhost:3333', {
    autoConnect: false,
    auth: {
        token: getCookie('accessToken')
    }
});

export default socket;