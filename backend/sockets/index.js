const { Server } = require("socket.io");
const authToken = require("./middlewares/socketTokenAuth");
const { registerChatHandler } = require("./../modules/Chat/chat.socket");

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

		//! TODO: Join User to all chats

		registerChatHandler(io, socket);

		// io.on("message:send", (data, cb) => {
		// 	const senderID = socket.user._id
		// 	const {chatID, text, file, location} = data
		// })
	});

	return io;
};
