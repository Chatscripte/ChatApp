import { io } from "socket.io-client";

const socket = io("ws://localhost:3333", {
    autoConnect: false,
    auth: {
        token: null,
    },
});
export const updateSocketAuth = (accessToken: string | null) => {
    socket.auth = { token: accessToken };
};

export default socket;