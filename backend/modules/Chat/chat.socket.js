const { createNewChat } = require("./chat.controller");

exports.registerChatHandler = (io, socket) => {
	io.on("chat:create", async (data, cb) => {
		try {
			const result = await createNewChat(socket, data);

			if (result.success === false) {
				return cb({
					success: false,
					message: result.message,
					data: result.data ? result.data : undefined,
				});
			}

			const chatMembers = result.chat.members;

			chatMembers.forEach((member) => {
				io.to(member.user._id.toString()).emit("chat:created", result);
			});

			cb({ success: true });
		} catch (err) {
			cb({ success: false, message: err.message });
		}
	});
};
