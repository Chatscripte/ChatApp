const express = require("express");
const path = require("path");
const cors = require("cors");
// const authRoutes = require("./routes/User.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());

module.exports = app;
