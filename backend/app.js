const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const path = require("path");

const authRoutes = require("./modules/Auth/auth.routes");
const userRoutes = require("./modules/User/user.routes");
const messageRoutes = require("./modules/Message/mesage.routes");

const apiDocRouter = require("./modules/ApiDoc/swagger.routes");

const app = express();

//* Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//* CORS Policy
app.use(cors());

//* Statics
app.use(
	"/files",
	express.static(path.join(__dirname, "public/uploads/messages"))
);

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

app.use("/api-doc", apiDocRouter);

//* Error Handler
app.use((req, res) => {
	return res.status(404).json({ msg: "Not Found Path" });
});

app.use(errorHandler);

module.exports = app;
