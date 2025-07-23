const { errorResponse } = require("../../helpers/responses");
const validatorErrorHandler = require("../../helpers/validatorErrorHandler");
const authService = require("./auth.service");
const { authValidator } = require("./auth.validator");

exports.authOrRegister = async (req, res, next) => {
	try {
		//* Validation
		const validationResult = authValidator.safeParse(req.body);
		if (!validationResult.success) {
			return validatorErrorHandler(res, validationResult);
		}

		//* Data
		const { identifier, password } = validationResult.data;

		res.json({ identifier, password });
	} catch (err) {
		next(err);
	}
};
