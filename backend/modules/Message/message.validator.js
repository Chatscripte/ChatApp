const { z } = require("zod");
const configs = require("./../../configs");

const BASE_URL = configs.domain;
const FILE_ROUTE_PREFIX = "/files/";

const messageSchema = z.object({
	text: z.string().trim().min(1).optional(),

	fileUrl: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val) return true;
				return val.startsWith(`${BASE_URL}${FILE_ROUTE_PREFIX}`);
			},
			{
				message:
					"File URL must start with your base URL and /files/ route",
			}
		),

	location: z
		.object({
			x: z.number(),
			y: z.number(),
		})
		.optional(),
});

module.exports = { messageSchema };
