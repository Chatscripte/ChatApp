module.exports = {
	db: {
		URI: process.env.DB_URI,
	},

	port: process.env.PORT || 4000,

	auth: {
		accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
		refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
		accessTokenExpriesInSeconds:
			process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
		refreshTokenExpriesInSeconds:
			process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
	},

	domain: process.env.DOMAIN,

	isProduction: process.env.NODE_ENV === "production",
};
