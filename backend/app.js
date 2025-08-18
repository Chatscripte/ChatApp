const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const path = require("path");
const configs = require("./configs");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/Auth/auth.routes");
const userRoutes = require("./modules/User/user.routes");
const messageRoutes = require("./modules/Message/mesage.routes");
const chatRoutes = require("./modules/Chat/chat.routes");

const apiDocRouter = require("./modules/ApiDoc/swagger.routes");

const app = express();

//* Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//* Cookie
app.use(cookieParser(configs.auth.refreshTokenSecretKey));

//* CORS Policy
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

//* Statics
app.use(
	"/files",
	express.static(path.join(__dirname, "public/uploads/messages"))
);

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use("/api-doc", apiDocRouter);

//* Error Handler
app.use((req, res) => {
	return res.status(404).json({ msg: "Not Found Path" });
});

app.use(errorHandler);

module.exports = app;
