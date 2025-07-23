const { z } = require("zod");

const identifierSchema = z
	.union([
		z.email(),
		z
			.string()
			.min(3)
			.max(20)
			.regex(/^[a-zA-Z0-9_-]{3,20}$/),
	])
	.refine((val) => val, { message: "Invalid Identifier" });

const authValidator = z.object({
	identifier: identifierSchema,
	password: z.string().min(8).max(32),
});

module.exports = { authValidator };
