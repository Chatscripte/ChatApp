const { z } = require("zod");

const pvChatValidator = z.object({
	recipientUsername: z
		.string()
		.min(3)
		.max(20)
		.regex(/^[a-zA-Z0-9_-]{3,20}$/),
});

const groupChatValidator = z.object({
	title: z.string().min(3).max(30),
});

module.exports = { pvChatValidator, groupChatValidator };
