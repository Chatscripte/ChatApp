const { Server } = require("socket.io");

module.exports = (server) => {
	const io = new Server(server, {
		cors: { origin: "*" },
	});

	io.on("connection", (socket) => {
		console.log("New client connected:", socket.id);
	});

	return io;
};
