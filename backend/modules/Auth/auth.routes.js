const express = require("express");
const { authOrRegister } = require("./auth.controller");

const router = express.Router();

router.route("/").post(authOrRegister);

module.exports = router;
