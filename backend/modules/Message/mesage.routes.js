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
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mpeg",
  "video/quicktime",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.oasis.opendocument.text",
  "text/plain",
  "application/rtf",
];

const multer = uploader(dest, allowedFormats);

const router = express.Router();

router
  .route("/upload")
  .post(tokenAuth, multer.single("file"), controller.uploadFile);

module.exports = router;
