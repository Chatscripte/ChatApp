const express = require("express");
const controller = require("./chat.controller");
const tokenAuth = require("../../middlewares/tokenAuth");

const router = express.Router();

router.route("/").post(tokenAuth, controller.createNewChat);

router.route("/search").post(controller.findChats);

module.exports = router;
