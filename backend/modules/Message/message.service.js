const MessageModel = require("./../../models/Message");
const MembershipModel = require("./../../models/Membership");

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

exports.findMessageByID = async (messageID) => {
	if (!isValidObjectId(messageID)) return false;

	const message = await MessageModel.findById(messageID);

	return message ? message : false;
};

exports.seenByNewUser = async (chatID, userID, messageID) => {
	const message = await MessageModel.findByIdAndUpdate(
		messageID,
		{
			$addToSet: {
				seenBy: userID,
			},
		},
		{ new: true }
	);

	const membership = await MembershipModel.findOneAndUpdate(
		{
			chat: chatID,
			user: userID,
		},
		{ lastSeenMessage: messageID }
	);

	if (!message || !membership) {
		return { status: false, err: "Something Went Wrong!" };
	}

	return message;
};
