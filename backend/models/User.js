const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

userSchema.index({ username: 1 });

const model = mongoose.model("User", userSchema);

module.exports = model;
