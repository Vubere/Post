"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("uncaught exception occurred: Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
const port = process.env.PORT || 3000;
const mongodbConStr = process.env.MONGODB_CONNECTION || "localhost:8080";
mongoose_1.default.connect(mongodbConStr).then((con) => {
    console.log("db connection successful!");
});
const server = app_1.default.listen(port, () => {
    console.log(`server is running on ${port}!`);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("unhandled promise rejection occurred: Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
