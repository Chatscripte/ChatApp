const express = require("express");
const controller = require("./message.controller");
const tokenAuth = require("../../middlewares/tokenAuth");
const uploader = require("./../../utils/multerConfigs");
const path = require("path");

const dest = path.join(__dirname, "..", "..", "public", "uploads", "messages");
const allowedFormats = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"video/mp4",
	"application/pdf",
];

const multer = uploader(dest, allowedFormats);

const router = express.Router();

router
	.route("/upload")
	.post(tokenAuth, multer.single("file"), controller.uploadFile);

module.exports = router;
