"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRequestTime = exports.logger = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const logger = function (req, res, next) {
    next();
};
exports.logger = logger;
const addRequestTime = function (req, res, next) {
    res.requestedAt = (0, dayjs_1.default)().format("DD-MM-YYYY HH:mm:ss");
    next();
};
exports.addRequestTime = addRequestTime;
