const mongoose = require("mongoose");

const chatShema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["PV", "GROUP"],
			required: true,
		},
		title: {
			type: String,
			required: false,
		},
		owner: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: false,
		},
		profile: {
			type: String,
			require: false,
			default: undefined,
		},
		inviteLink: {
			type: String,
			required: false,
			unique: true,
			sparse: true,
		},
		lastMessage: {
			type: mongoose.Types.ObjectId,
			ref: "Message",
			require: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("Chat", chatShema);

module.exports = model;
