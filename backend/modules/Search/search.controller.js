const { successResponse, errorResponse } = require("../../helpers/responses");
const chatService = require("./../Chat/chat.service");
const userService = require("./../User/user.service");

exports.search = async (req, res, next) => {
	try {
		const { keyword } = req.body;
		const trimmedKeyword = keyword.trim();

		if (!trimmedKeyword) {
			return errorResponse(res, 400, "Keyword is Require");
		}

		const chatsResults = await chatService.searchChats(trimmedKeyword);
		const usersResults = await userService.searchUsers(trimmedKeyword);

		return successResponse(res, 200, {
			chats: chatsResults,
			users: usersResults,
		});
	} catch (err) {
		next(err);
	}
};
