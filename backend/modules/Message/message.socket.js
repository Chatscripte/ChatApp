const { createNewMessage } = require("./message.controller");

exports.registerMessageHandler = (io, socket) => {
	io.on("message:send", async (data, cb) => {
		try {
			const result = await createNewMessage(socket, data);

			if (result.success === false) {
				return cb({
					success: false,
					message: result.message,
					data: result.data ? result.data : undefined,
				});
			}

			const chatID = data.chatID;

			io.to(chatID).emit("meessage:sent", result);

			cb({ success: true });
		} catch (err) {
			cb({ success: false, message: err.message });
		}
	});
};
