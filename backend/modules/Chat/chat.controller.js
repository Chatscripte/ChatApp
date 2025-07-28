const validatorErrorHandler = require("../../helpers/validatorErrorHandler");
const chatService = require("./chat.service");
const authService = require("./../Auth/auth.service");
const { pvChatValidator, groupChatValidator } = require("./chat.validator");
const { errorResponse, successResponse } = require("../../helpers/responses");

const createPv = async (res, ownerID, recipientUsername) => {
	//* Validation
	const validationResult = pvChatValidator.safeParse({
		recipientUsername,
	});
	if (!validationResult.success) {
		return validatorErrorHandler(res, validationResult);
	}

	//*
	const recipient = await authService.findUserByIdentifier(recipientUsername);

	if (!recipient) {
		return errorResponse(res, 404, "Recipient Not Found!");
	}

	if (ownerID.toString() === recipient._id.toString()) {
		return errorResponse(
			res,
			400,
			"chat creator and recipient is the same!"
		);
	}

	const newChatData = await chatService.createPvChat(ownerID, recipient._id);

	if (newChatData.status === false) {
		return errorResponse(res, 400, newChatData.message);
	}

	return successResponse(res, 201, { message: "Created successfully" });
};

const createGroup = async (res, ownerID, title) => {
	//* Validation
	const validationResult = groupChatValidator.safeParse({
		title,
	});
	if (!validationResult.success) {
		return validatorErrorHandler(res, validationResult);
	}

	//! TODO: Complete this func
	const newChatData = await chatService.createGroupChat(ownerID, title);

	if (newChatData.status === false) {
		return errorResponse(res, 400, newChatData.message);
	}

	return successResponse(res, 201, {
		message: "Created successfully",
	});
};

exports.createNewChat = async (req, res, next) => {
	try {
		let { type, title, recipientUsername } = req.body;
		let ownerID = req.user._id;

		type = type.toUpperCase();

		if (type === "PV") {
			return await createPv(res, ownerID, recipientUsername);
			//! TODO: Socket emmiting
		}

		if (type === "GROUP") {
			return await createGroup(res, ownerID, title);
			//! TODO: Socket emmiting
		}

		return errorResponse(res, 400, "Invalid chat type");
	} catch (err) {
		next(err);
	}
};
