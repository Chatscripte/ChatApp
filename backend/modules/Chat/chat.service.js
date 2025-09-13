const ChatModel = require("./../../models/Chat");
const MembershipModel = require("./../../models/Membership");
const messageService = require("./../Message/message.service");
const crypto = require("crypto");
const { isValidObjectId } = require("mongoose");

const isExistingPvChat = async (userA, userB) => {
	const userAChats = await MembershipModel.find({ user: userA }).distinct(
		"chat"
	);

	const commonChat = await MembershipModel.find({
		user: userB,
		chat: { $in: userAChats },
	}).distinct("chat");

	const existingPvChat = await ChatModel.findOne({
		_id: { $in: commonChat },
		type: "PV",
	});

	if (existingPvChat) {
		return true;
	}

	return false;
};

const codeGenerator = (title) => {
	const slug = title.toLowerCase().replace(/\s+/g, "-");
	const random = crypto.randomBytes(3).toString("hex");
	return `${slug}-${random}`;
};

exports.createNewMembership = async (chat, user, role) => {
	const newMembership = await MembershipModel.create({
		user,
		chat,
		role,
	});

	return newMembership ? newMembership : false;
};

exports.createPvChat = async (userA, userB) => {
	if (await isExistingPvChat(userA, userB)) {
		return { status: false, message: "This chat already exists!" };
	}

	const newChat = await ChatModel.create({ type: "PV" });

	if (!newChat) {
		return { status: false, message: "Something Went Wrong!" };
	}

	const addMemberships = await MembershipModel.bulkWrite([
		{
			insertOne: {
				document: { user: userA, chat: newChat._id, role: "MEMBER" },
			},
		},
		{
			insertOne: {
				document: { user: userB, chat: newChat._id, role: "MEMBER" },
			},
		},
	]);
	if (addMemberships.insertedCount !== 2) {
		return { status: false, message: "Something Went Wrong!" };
	}

	const members = await MembershipModel.find({ chat: newChat._id })
		.populate("user", "-password")
		.select("user role -_id");

	return {
		chatInfo: { _id: newChat._id, type: newChat.type },
		members,
	};
};

exports.createGroupChat = async (owner, title) => {
	const inviteCode = codeGenerator(title);

	const newChat = await ChatModel.create({
		type: "GROUP",
		title,
		owner,
		inviteCode,
	});

	if (!newChat) {
		return { status: false, message: "Something Went Wrong!" };
	}

	const newMembership = await this.createNewMembership(
		newChat._id,
		owner,
		"OWNER"
	);

	if (!newMembership) {
		return { status: false, message: "Something Went Wrong!" };
	}

	const membership = await MembershipModel.find({ _id: newMembership._id })
		.populate("user", "-password")
		.select("user role -_id");

	return {
		chatInfo: await newChat.populate("owner", "-password"),
		members: membership,
	};
};

exports.findChatById = async (chatID) => {
	if (!isValidObjectId(chatID)) return false;

	const chat = await ChatModel.findById(chatID);

	return chat ? chat : false;
};

exports.findChatByCode = async (code) => {
	const chat = await ChatModel.findOne({ inviteCode: code }).populate({
		path: "lastMessage",
		populate: {
			path: "sender",
			model: "User",
			select: "username",
		},
		select: "-updatedAt -chat",
	});

	return chat ? chat : false;
};

exports.updateChatLastMessage = async (chatID, messageID) => {
	const updatedChat = await ChatModel.findByIdAndUpdate(
		chatID,
		{
			$set: {
				lastMessage: messageID,
			},
		},
		{ new: true }
	)
		.populate("owner", "-password")
		.populate({
			path: "lastMessage",
			populate: {
				path: "sender",
				model: "User",
				select: "username",
			},
			select: "-updatedAt -chat",
		});

	return updatedChat;
};

exports.getAllChats = async (userID) => {
	const chatIds = await MembershipModel.find({ user: userID }).distinct(
		"chat"
	);

	const chats = await ChatModel.find({ _id: { $in: chatIds } })
		.populate({
			path: "lastMessage",
			populate: {
				path: "sender",
				model: "User",
				select: "username",
			},
			select: "-updatedAt -chat",
		})
		.lean();

	return chats;
};

exports.getChatDetails = async (chatID) => {
	if (!isValidObjectId(chatID)) return false;

	const chatInfo = await ChatModel.findById(chatID)
		.populate("owner", "-passowrd -updatedAt -createdAt")
		.select("-lastMessage -updatedAt");

	if (!chatInfo) return false;

	const members = await MembershipModel.find({ chat: chatID })
		.populate("user", "-password")
		.select("user role -_id");

	const messages = await messageService.findChatMessages(chatID);

	const chat = {
		chatInfo,
		members,
		messages,
	};

	return chat;
};

exports.searchChats = async (keyword) => {
	const results = await ChatModel.aggregate([
		{
			$match: { title: { $regex: keyword, $options: "i" } },
		},
		{
			$addFields: {
				exactMatch: {
					$eq: [{ $toLower: "$title" }, keyword.toLowerCase()],
				},
			},
		},
		{
			$sort: { exactMatch: -1, title: 1 },
		},
		{
			$project: {
				_id: 1,
				title: 1,
				profile: 1,
				exactMatch: 1,
			},
		},
	]);

	return results;
};

exports.findMembership = async (chat, user) => {
	const membership = await MembershipModel.findOne({ chat, user });

	return membership ? membership : false;
};

