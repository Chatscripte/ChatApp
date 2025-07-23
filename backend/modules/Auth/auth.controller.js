const { errorResponse, successResponse } = require("../../helpers/responses");
const validatorErrorHandler = require("../../helpers/validatorErrorHandler");
const authService = require("./auth.service");
const { authValidator } = require("./auth.validator");
const bcrypt = require("bcrypt");

const register = async (res, identifier, password) => {
	const newUser = await authService.createUser(identifier, password);

	if (!newUser) {
		return errorResponse(res, 500, "Something Went wrong!");
	}

	const accessToken = authService.createAccessToken(newUser._id);

	return successResponse(res, 201, { accessToken, isNew: true });
};

exports.authOrRegister = async (req, res, next) => {
	try {
		//* Validation
		const validationResult = authValidator.safeParse(req.body);
		if (!validationResult.success) {
			return validatorErrorHandler(res, validationResult);
		}

		//* Data
		const { identifier, password } = validationResult.data;

		const salt = bcrypt.genSaltSync(8);
		const hashedPassword = bcrypt.hashSync(password, salt);

		const user = await authService.findUserByIdentifier(identifier);

		if (!user) {
			return await register(res, identifier, hashedPassword);
		}

		const comparePasswords = bcrypt.compareSync(password, user.password);
		if (!comparePasswords) {
			return errorResponse(res, 400, "Inccorect password");
		}

		const accessToken = authService.createAccessToken(user._id);
		return successResponse(res, 201, { accessToken, isNew: false });
	} catch (err) {
		next(err);
	}
};

exports.getMe = async (req, res, next) => {
	try {
		const user = req.user;
		return successResponse(res, 200, user);
	} catch (err) {
		next(err);
	}
};
