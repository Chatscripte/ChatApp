const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		group: {
			type: mongoose.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("MemberShip", membershipSchema);

module.exports = model;
