const { z } = require("zod");

const updateUserValidator = z.object({
	username: z
		.string()
		.min(3)
		.max(20)
		.regex(/^[a-zA-Z0-9_-]{3,20}$/),
	email: z.email(),
});

module.exports = { updateUserValidator };
