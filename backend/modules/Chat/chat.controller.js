const validatorErrorHandler = require("../../sockets/helpers/socketValidatorErrorHandler");
const chatService = require("./chat.service");
const authService = require("./../Auth/auth.service");
const { pvChatValidator, groupChatValidator } = require("./chat.validator");

const createPv = async (ownerID, recipientUsername) => {
	//* Validation
	const validationResult = pvChatValidator.safeParse({
		recipientUsername,
	});
	if (!validationResult.success) {
		return validatorErrorHandler(validationResult);
	}

	//*
	const recipient = await authService.findUserByIdentifier(recipientUsername);

	if (!recipient) {
		return { success: false, message: "Recipient Not Found!" };
	}

	if (ownerID.toString() === recipient._id.toString()) {
		return {
			success: false,
			message: "chat creator and recipient is the same!",
		};
	}

	const newChatData = await chatService.createPvChat(ownerID, recipient._id);

	if (newChatData.status === false) {
		return {
			success: false,
			message: newChatData.message,
		};
	}

	return {
		success: true,
		message: "Created Successfully",
		chat: newChatData,
	};
};

const createGroup = async (ownerID, title) => {
	//* Validation
	const validationResult = groupChatValidator.safeParse({
		title,
	});
	if (!validationResult.success) {
		return validatorErrorHandler(validationResult);
	}

	const newChatData = await chatService.createGroupChat(ownerID, title);

	if (newChatData.status === false) {
		return {
			success: false,
			message: newChatData.message,
		};
	}

	return {
		success: true,
		message: "Created Successfully",
		chat: newChatData,
	};
};

exports.createNewChat = async (socket, data) => {
	let { type, title, recipientUsername } = data;
	let ownerID = socket.user._id;

	type = type.toUpperCase();

	if (type === "PV") {
		return await createPv(ownerID, recipientUsername);
	}

	if (type === "GROUP") {
		return await createGroup(ownerID, title);
	}

	return { success: false, message: "Invalid Chat type" };
};
