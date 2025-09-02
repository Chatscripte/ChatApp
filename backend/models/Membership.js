const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		chat: {
			type: mongoose.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		role: {
			type: String,
			enum: ["OWNER", "MEMBER"],
		},
		lastSeenMessage: {
			type: mongoose.Types.ObjectId,
			ref: "Message",
			required: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("MemberShip", membershipSchema);

module.exports = model;
