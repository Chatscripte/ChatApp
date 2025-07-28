const validatorErrorHandler = require("../../helpers/validatorErrorHandler");
const chatService = require("./chat.service");
const authService = require("./../Auth/auth.service");
const { pvChatValidator, groupChatValidator } = require("./chat.validator");
const { errorResponse } = require("../../helpers/responses");

exports.createNewChat = async (req, res, next) => {
	try {
		let { type, title, recipientUsername } = req.body;
		let ownerID = req.user._id;

		type = type.toUpperCase();

		if (type === "PV") {
			//* Validation
			const validationResult = pvChatValidator.safeParse({
				recipientUsername,
			});
			if (!validationResult.success) {
				return validatorErrorHandler(res, validationResult);
			}

			//*
			const recipient = await authService.findUserByIdentifier(
				recipientUsername
			);

			if (!recipient) {
				return errorResponse(res, 404, "Recipient Not Found!");
			}

			//! TODO: Complete this func
			const newChat = await chatService.createPvChat(
				ownerID,
				recipient._id
			);

			//! TODO: Socket emmiting
		}
		if (type === "GROUP") {
			//* Validation
			const validationResult = groupChatValidator.safeParse({
				title,
			});
			if (!validationResult.success) {
				return validatorErrorHandler(res, validationResult);
			}

			//! TODO: Complete this func
			const newChat = await chatService.createGroupChat(
				ownerID,
				recipient._id
			);

			//! TODO: Socket emmiting
		}

		return errorResponse(res, 400, "Invalid chat type");
	} catch (err) {
		next(err);
	}
};
