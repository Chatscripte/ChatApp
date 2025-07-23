const express = require("express");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./modules/Auth/auth.routes");
const userRoutes = require("./modules/User/user.routes");

const apiDocRouter = require("./modules/ApiDoc/swagger.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api-doc", apiDocRouter);

module.exports = app;
