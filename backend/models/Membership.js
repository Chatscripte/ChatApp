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
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("MemberShip", membershipSchema);

module.exports = model;
