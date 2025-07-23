const { z } = require("zod");

const identifierSchema = z
	.union([
		z.email(),
		z
			.string()
			.min(3)
			.max(30)
			.regex(/^[a-zA-z0-9_]+$/),
	])
	.refine((val) => val, { message: "Invalid Identifier" });

const authValidator = z.object({
	identifier: identifierSchema,
	password: z.string().min(8).max(32),
});

module.exports = { authValidator };
