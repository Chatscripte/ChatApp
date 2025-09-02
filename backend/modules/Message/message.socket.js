const { createNewMessage, seenMessage } = require("./message.controller");

exports.registerMessageHandler = (io, socket) => {
	socket.on("message:send", async (data, cb) => {
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

			io.to(chatID).emit("message:sent", result);

			cb({ success: true });
		} catch (err) {
			cb({ success: false, message: err.message });
		}
	});

	socket.on("message:seen", async (data, cb) => {
		try {
			const result = await seenMessage(socket, data);

			if (result.success === false) {
				return cb({
					success: false,
					err: result.errMsg,
				});
			}

			const chatID = result.chat;

			io.to(chatID).emit("message:seen", {
				messageID: result.message,
				seenBy: result.seenBy,
			});

			cb({ success: true });
		} catch (err) {
			cb({ success: false, message: err.message });
		}
	});
};
