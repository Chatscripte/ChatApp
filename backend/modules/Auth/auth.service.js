const UserModel = require("./../../models/User");

const jwt = require("jsonwebtoken");
const configs = require("./../../configs");

exports.findUserByIdentifier = async (identifier) => {
	const user = await UserModel.findOne({
		$or: [{ email: identifier }, { username: identifier }],
	});

	if (!user) return false;
	return user;
};

exports.findUserById = async (userID) => {
	const user = await UserModel.findById(userID).select("-password");
	return user;
};

const createRandomUsername = () => {
	return `Anonymous${Math.round(Math.random() * 9999)}_${Math.round(
		Math.random() * 99
	)}`;
};
exports.createUser = async (identifier, password) => {
	const isEmail = identifier.includes("@");

	const user = await UserModel.create({
		username: isEmail ? createRandomUsername() : identifier,
		email: isEmail ? identifier : undefined,
		password,
	});

	return user;
};

exports.createAccessToken = (userID) => {
	const accessToken = jwt.sign(
		{ userID },
		configs.auth.accessTokenSecretKey,
		{
			expiresIn: configs.auth.accessTokenExpriesInSeconds,
		}
	);

	return accessToken;
};

exports.createRefreshToken = (userId) => {
	const refreshToken = jwt.sign(
		{ userId },
		configs.auth.refreshTokenSecretKey,
		{ expiresIn: configs.auth.refreshTokenExpriesInSeconds }
	);

	return refreshToken;
};

exports.verifyRefreshToken = async (refreshToken) => {
	const payload = jwt.verify(
		refreshToken,
		configs.auth.refreshTokenSecretKey,
		(err, decoded) => {
			if (err) {
				return false;
			}
			return decoded;
		}
	);
	return payload;
};
