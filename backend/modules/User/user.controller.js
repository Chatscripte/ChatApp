const userService = require("./user.service");
const authService = require("./../Auth/auth.service");
const { errorResponse, successResponse } = require("../../helpers/responses");
const { updateUserValidator } = require("./user.validator");
const validatorErrorHandler = require("../../helpers/validatorErrorHandler");

exports.updateUserInformation = async (req, res, next) => {
	try {
		//* Validation
		const validationResult = updateUserValidator.safeParse(req.body);
		if (!validationResult.success) {
			return validatorErrorHandler(res, validationResult);
		}

		//* Data
		const { username, email } = validationResult.data;
		const userID = req.user._id;

		const updatedUser = await userService.updateUser(userID, {
			username,
			email,
		});

		if (!updatedUser) {
			return errorResponse(res, 500, "Something Went Wrong");
		}

		return successResponse(res, 200, {
			message: "Successfully updated!",
			user: updatedUser,
		});
	} catch (err) {
		next(err);
	}
};
