const chatService = require("./chat.service");

exports.createNewChat = async (req, res, next) => {
	try {
		let { type, title, recipientUsername } = req.body;

		type = type.toUpperCase();

		if (type === "PV") {
		}
		if (type === "GROUP") {
		}
	} catch (err) {
		next(err);
	}
};
