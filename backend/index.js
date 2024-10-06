"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const custom_error_1 = __importDefault(require("./lib/utils/custom-error"));
const utils_1 = require("./lib/utils");
const chat_1 = require("./controllers/chat");
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("uncaught exception occurred: Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
const port = Number(process.env.PORT || 3000);
const mongodbConStr = process.env.MONGODB_CONNECTION || "localhost:8080";
mongoose_1.default.connect(mongodbConStr).then((con) => {
    console.log("db connection successful!");
});
const server = app_1.default.listen(port, () => {
    console.log(`server is running on ${port}!`);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", chat_1.socketManager);
app_1.default.all("*", (...args) => {
    const [req, , next] = args;
    const error = new custom_error_1.default("route not found: " + req.url, utils_1.STATUS_CODES.clientError.Not_Found);
    next(error);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("unhandled promise rejection occurred: Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
