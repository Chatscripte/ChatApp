const MessageModel = require("./../../models/Message");

exports.createMessage = async (messageData) => {
	const newMessage = await (
		await MessageModel.create(messageData)
	).populate("sender", "-password");

	if (!newMessage) {
		return { status: false, message: "Something Went Wrong!" };
	}

	const message = await MessageModel.findById(newMessage._id)
		.populate("sender", "-password -updatedAt -createdAt")
		.select("-updatedAt -chat");

	return message;
};

exports.findChatMessages = async (chatID) => {
	const messaegs = await MessageModel.find({ chat: chatID })
		.populate("sender", "-password")
		.select("-chat")
		.lean();

	return messaegs;
};
