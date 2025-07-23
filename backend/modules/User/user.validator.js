const { z } = require("zod");

const updateUserValidator = z.object({
	username: z
		.string()
		.min(3)
		.max(30)
		.regex(/^[a-zA-z0-9_]+$/),
	email: z.email(),
});

module.exports = { updateUserValidator };
