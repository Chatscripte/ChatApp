const ChatModel = require("./../../models/Chat");
const MembershipModel = require("./../../models/Membership");
const crypto = require("crypto");
const configs = require("./../../configs");

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

const linkGenerator = (title) => {
	const slug = title.toLowerCase().replace(/\s+/g, "-");
	const random = crypto.randomBytes(3).toString("hex");
	return `${configs.domain}/${slug}-${random}`;
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
	const inviteLink = linkGenerator(title);

	const newChat = await ChatModel.create({
		type: "GROUP",
		title,
		owner,
		inviteLink,
		profile: "test.png",
	});

	if (!newChat) {
		return { status: false, message: "Something Went Wrong!" };
	}

	const newMembership = await MembershipModel.create({
		user: owner,
		chat: newChat._id,
		role: "OWNER",
	});

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
