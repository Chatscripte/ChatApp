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
			required: true,
		},
		owner: {
			type: String,
			required: false,
		},
		profile: {
			type: String,
			require: false,
		},
		inviteLink: {
			type: String,
			unique: true,
			required: true,
		},
		//! TODO: add lastMessage field after creating Message collection
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("Chat", chatShema);

module.exports = model;
