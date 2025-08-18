const { successResponse } = require("../../helpers/responses");
const chatService = require("./../Chat/chat.service");
const userService = require("./../User/user.service");

exports.search = async (req, res, next) => {
	try {
		const { keyword } = req.body;

		const chatsResults = await chatService.searchChats(keyword);
		const usersResults = await userService.searchUsers(keyword);

		return successResponse(res, 200, {
			chats: chatsResults,
			users: usersResults,
		});
	} catch (err) {
		next(err);
	}
};
