module.exports = async (result) => {
	const issues = result.error.issues;
	const errorMsgs = [];

	issues.forEach((issue) => {
		errorMsgs.push({ path: issue.path[0], message: issue.message });
	});

	return { success: false, message: "Validation Failed", data: errorMsgs };
};
