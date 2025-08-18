const express = require("express");
const controller = require("./search.controller");
const tokenAuth = require("../../middlewares/tokenAuth");

const router = express.Router();

router.route("/").post(controller.search);

module.exports = router;
