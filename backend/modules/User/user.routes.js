const express = require("express");
const controller = require("./user.controller");
const tokenAuth = require("../../middlewares/tokenAuth");

const router = express.Router();

router.route("/").put(tokenAuth, controller.updateUserInformation);
module.exports = router;
