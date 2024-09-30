"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./lib/utils/middlewares");
const morgan_1 = __importDefault(require("morgan"));
const user_1 = __importDefault(require("./routers/user"));
const auth_1 = __importDefault(require("./routers/auth"));
const post_1 = __importDefault(require("./routers/post"));
const comment_1 = __importDefault(require("./routers/comment"));
const notifications_1 = __importDefault(require("./routers/notifications"));
const auth_2 = __importDefault(require("./controllers/auth"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const custom_error_1 = __importDefault(require("./lib/utils/custom-error"));
const error_1 = __importDefault(require("./controllers/error"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const utils_1 = require("./lib/utils");
dotenv_1.default.config();
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    max: 3000,
    windowMs: 60 * 60 * 1000,
    message: "you have exceeded the amount of allowed request, try again in an hour!",
});
app.use(middlewares_1.logger);
app.use(middlewares_1.addRequestTime);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static("./public"));
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "20mb" }));
app.use(limiter);
app.use((0, xss_clean_1.default)());
app.use((0, hpp_1.default)({ whitelist: [] }));
app.use((0, cors_1.default)());
const baseRootUsers = "/api/users";
const baseRootPosts = "/api/posts";
const baseRootComments = "/api/comments";
const baseRootNotification = "/api/notifications";
app.post(baseRootUsers + "/login", auth_2.default.Login);
app.use(baseRootUsers, auth_1.default);
app.use(baseRootUsers, auth_2.default.ProtectRoutes, user_1.default);
app.use(baseRootPosts, auth_2.default.ProtectRoutes, post_1.default);
app.use(baseRootComments, auth_2.default.ProtectRoutes, comment_1.default);
app.use(baseRootNotification, auth_2.default.ProtectRoutes, notifications_1.default);
app.all("*", (...args) => {
    const [req, , next] = args;
    const error = new custom_error_1.default("route not found: " + req.url, utils_1.STATUS_CODES.clientError.Not_Found);
    next(error);
});
app.use(error_1.default);
exports.default = app;
