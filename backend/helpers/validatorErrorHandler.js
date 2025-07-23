const { errorResponse } = require("./responses");

module.exports = async (res, result) => {
	const issues = result.error.issues;
	const errorMsgs = [];

	issues.forEach((issue) => {
		errorMsgs.push({ path: issue.path[0], message: issue.message });
	});

	return errorResponse(res, 422, "Validation Failed", errorMsgs);
};
