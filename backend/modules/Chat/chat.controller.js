const validatorErrorHandler = require("../../sockets/helpers/socketValidatorErrorHandler");
const chatService = require("./chat.service");
const authService = require("./../Auth/auth.service");
const { pvChatValidator, groupChatValidator } = require("./chat.validator");
const { successResponse } = require("../../helpers/responses");

exports.findChats = async (req, res, next) => {
	try {
		const { keyword } = req.body;

		const results = await chatService.searchChats(keyword);

		return successResponse(res, 200, results);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (socket) => {
	const userID = socket.user._id;

	const chats = await chatService.getAllChats(userID);

	return chats;
};

exports.getOne = async (data) => {
	const { chatID } = data;

	const chat = await chatService.getChatDetails(chatID);

	if (!chat) {
		return {
			success: false,
			message: "Chat not found",
		};
	}

	return {
		success: true,
		chat,
	};
};
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
