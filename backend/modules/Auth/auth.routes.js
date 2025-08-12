const express = require("express");
const {
	authOrRegister,
	getMe,
	getNewAccessToken,
} = require("./auth.controller");
const tokenAuth = require("../../middlewares/tokenAuth");

const router = express.Router();

router.route("/").post(authOrRegister);
router.route("/getMe").get(tokenAuth, getMe);
router.route("/refresh-token").post(getNewAccessToken);

module.exports = router;
