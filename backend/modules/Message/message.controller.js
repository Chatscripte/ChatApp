const messageService = require("./message.service");
const chatService = require("./../Chat/chat.service");
const { errorResponse, successResponse } = require("../../helpers/responses");
const configs = require("./../../configs");
const { messageSchema } = require("./message.validator");
const validatorErrorHandler = require("../../sockets/helpers/socketValidatorErrorHandler");

exports.uploadFile = async (req, res, next) => {
	try {
		if (!req.file) {
			return errorResponse(res, 400, "Not uploaded");
		}

		return successResponse(res, 201, {
			message: "File uploaded successfully",
			fileUrl: `${configs.domain}/files/${req.file.filename}`,
		});
	} catch (err) {
		next(err);
	}
};
exports.createNewMessage = async (socket, data) => {
	const senderID = socket.user._id;
	const { chatID, text, fileUrl, location } = data;

	//* Chat ID Validation
	const chat = await chatService.findChatById(chatID);
	if (!chat) {
		return {
			success: false,
			message: "Chat not found",
		};
	}

	//* Others Data Validation
	const validationResult = messageSchema.safeParse({
		text,
		fileUrl,
		location,
	});

	if (!validationResult.success) {
		return validatorErrorHandler(validationResult);
	}

	if (!text && !fileUrl && !location) {
		return {
			success: false,
			message: "One of text, fileUrl, or location is required",
		};
	}

	//* Creating Document
	const messageData = {
		sender: senderID,
		chat: chatID,
		text: text ? text.trim() : undefined,
		fileUrl: fileUrl ? fileUrl.trim() : undefined,
		location: location ? location : undefined,
	};

	const newMessage = await messageService.createMessage(messageData);

	if (newMessage.status === false) {
		return {
			success: false,
			message: newMessage.message,
		};
	}

	const updatedChat = await chatService.updateChatLastMessage(
		chatID,
		newMessage._id
	);

	return {
		success: true,
		message: "Created Successfully",
		data: { message: newMessage, chat: updatedChat },
	};
};
