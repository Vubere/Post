"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const notification_1 = __importDefault(require("../models/notification"));
const custom_error_1 = __importDefault(require("../lib/utils/custom-error"));
const utils_1 = require("../lib/utils");
const aynsc_error_handler_1 = require("../lib/utils/aynsc-error-handler");
const api_features_1 = require("../lib/utils/api-features");
const mongoose_1 = require("mongoose");
const notificationApiFeaturesAggregation = (query, authorQuery) => {
    query.sort = query.sort || { createdAt: -1 };
    return new api_features_1.ApiFeaturesAggregation([
        {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "ownerDetails",
        },
        {
            from: "users",
            localField: "notificationOrigin",
            foreignField: "_id",
            as: "notificationOriginDetails",
        },
    ], notification_1.default, query, [
        { path: "$ownerDetails", preserveNullAndEmptyArrays: true },
        "$notificationOriginDetails",
    ], authorQuery || {});
};
function markNotificationAsRead(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const userId = req.requesterId;
        if (id && userId) {
            yield notification_1.default.findByIdAndUpdate(id, {
                $set: {
                    unread: false,
                },
            });
            res
                .status(204)
                .json((0, utils_1.jsend)("success", undefined, "notification marked as read!"));
        }
        next(new custom_error_1.default("notification not found", 404));
        return;
    });
}
function getNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.query.userId = new mongoose_1.Types.ObjectId(req.requesterId);
        const notificationQuery = notificationApiFeaturesAggregation(req.query).aggregate();
        const notifications = yield notificationQuery;
        res
            .status(200)
            .json((0, utils_1.jsend)("success", notifications, "notifications fetched successfully!"));
    });
}
function createNotification(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const notification = yield notification_1.default.create(Object.assign(Object.assign({}, data), { unread: true }));
        return notification;
    });
}
const notificationExports = {
    markNotificationAsRead,
    getNotifications,
    createNotification: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield createNotification(req.body);
        res.status(204).json((0, utils_1.jsend)("success", undefined, "notification created!"));
    }),
};
exports.default = (0, aynsc_error_handler_1.wrapModuleFunctionsInAsyncErrorHandler)(notificationExports);
