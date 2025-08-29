const { Server } = require("socket.io");
const authToken = require("./middlewares/socketTokenAuth");
const { registerChatHandler } = require("./../modules/Chat/chat.socket");
const {
	registerMessageHandler,
} = require("./../modules/Message/message.socket");
const { roomOnlineUsersCount } = require("./funcs/onlineUsers");

module.exports = (server) => {
	const io = new Server(server, {
		cors: { origin: "*" },
	});

	//* middlewares
	io.use(authToken);

	io.on("connection", (socket) => {
		const user = socket.user;
		const userID = user._id.toString();

		//* Join to personal room
		socket.join(userID);

		registerChatHandler(io, socket);

		registerMessageHandler(io, socket);

		socket.on("disconnect", async () => {
			const rooms = Array.from(socket.rooms).filter(
				(r) => r !== socket.id
			);

			rooms.forEach((roomId) => {
				socket.leave(roomId);
				roomOnlineUsersCount(io, roomId);
			});
		});
	});

	return io;
};
