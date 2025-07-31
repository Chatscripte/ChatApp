const jwt = require("jsonwebtoken");
const authService = require("../../modules/Auth/auth.service");
const configs = require("../../configs");

module.exports = async (socket, next) => {
	try {
		const token = socket.handshake.auth?.token;

		if (!token) return next(new Error("No auth token!"));

		const decodedToken = jwt.verify(
			token,
			configs.auth.accessTokenSecretKey
		);
		const userID = decodedToken.userID;

		const user = await authService.findUserById(userID);

		if (!user) {
			return next(new Error("User not found"));
		}

		socket.user = user;
		next();
	} catch (error) {
		next(new Error("Invalid token"));
	}
};
