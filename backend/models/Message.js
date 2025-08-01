const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
	x: {
		type: Number,
		required: true,
	},
	y: {
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
	},
	{ timestamps: true, versionKey: false }
);

const model = mongoose.model("Message", messageSchema);
module.exports = model;
