const { errorResponse, successResponse } = require("../../helpers/responses");
const configs = require("./../../configs");

exports.uploadFile = async (req, res, next) => {
	try {
		if (!req.file) {
			errorResponse(res, 400, "Not uploaded");
		}

		return successResponse(res, 201, {
			message: "File uploaded successfully",
			fileUrl: `${configs.domain}/files/${req.file.filename}`,
		});
	} catch (err) {
		next(err);
	}
};
