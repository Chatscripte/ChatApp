const express = require("express");
const { authOrRegister, getMe } = require("./auth.controller");
const tokenAuth = require("../../middlewares/tokenAuth");

const router = express.Router();

router.route("/").post(authOrRegister);
router.route("/getMe").get(tokenAuth, getMe);

module.exports = router;
