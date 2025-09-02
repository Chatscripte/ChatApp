const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
	lat: {
		type: Number,
		required: true,
	},
	long: {
		type: Number,
		required: true,
	},
});

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		chat: {
			type: mongoose.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		text: {
			type: String,
			required: false,
		},
		fileUrl: {
			type: String,
			required: false,
		},
		location: {
			type: locationSchema,
			required: false,
		},
		seenBy: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("Message", messageSchema);
module.exports = model;
