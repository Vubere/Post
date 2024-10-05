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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketManager = void 0;
exports.sendChat = sendChat;
exports.markAsRead = markAsRead;
exports.getMessage = getMessage;
exports.getMessages = getMessages;
exports.getChats = getChats;
exports.deleteMessage = deleteMessage;
exports.deleteChat = deleteChat;
const comment_1 = __importDefault(require("../models/comment"));
const api_features_1 = require("../lib/utils/api-features");
const chat_1 = __importDefault(require("../models/chat"));
const mongoose_1 = __importDefault(require("mongoose"));
const chatApiFeaturesAggregation = (query, senderQuery) => {
    return new api_features_1.ApiFeaturesAggregation({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "senderDetails",
    }, comment_1.default, query, "$senderDetails", senderQuery);
};
const genereteChatId = (senderId, receiverId) => {
    return [senderId, receiverId].sort().join("-");
};
function sendChat(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { senderId, receiverId, read } = data;
        const chatId = genereteChatId(senderId, receiverId);
        const newChat = yield chat_1.default.create({
            chatId,
            senderId,
            receiverId,
            message: data.message,
            read: data.read,
        });
        return newChat;
    });
}
function markAsRead(id, chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chat_1.default.findByIdAndUpdate(id, {
            read: true,
        });
        return getMessages(chatId, userId);
    });
}
function getMessage(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat = yield chat_1.default.findById(id);
        return chat;
    });
}
function getMessages(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield chat_1.default.aggregate([
            {
                $match: {
                    chatId,
                },
            },
            { $sort: { sentAt: 1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "sender",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiver",
                },
            },
            { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true } },
        ]);
        return messages || [];
    });
}
const getLatestMessages = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(userId);
    console.log("latest messages", userId, id);
    const messages = yield chat_1.default.aggregate([
        {
            $match: {
                $or: [{ senderId: id }, { receiverId: id }],
            },
        },
        {
            $sort: { sentAt: -1 },
        },
        {
            $group: {
                _id: "$chatId",
                sentAt: { $first: "$sentAt" },
                senderId: { $first: "$senderId" },
                receiverId: { $first: "$receiverId" },
                message: { $first: "$message" },
                time: { $first: "$time" },
                read: { $first: "$read" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "sender",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "receiverId",
                foreignField: "_id",
                as: "receiver",
            },
        },
        {
            $unwind: { path: "$sender", preserveNullAndEmptyArrays: true },
        },
        {
            $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true },
        },
    ]);
    return messages;
});
function getChats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const chats = yield chat_1.default.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort({ sentAt: -1 });
        return chats || [];
    });
}
function deleteMessage(id, userId, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chat_1.default.deleteOne({
            _id: id,
            senderId: userId,
        });
        return getMessages(chatId, userId);
    });
}
function deleteChat(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chat_1.default.updateMany({ chatId, receiverId: userId }, {
            receiverId: null,
        });
        yield chat_1.default.updateMany({ chatId, senderId: userId }, {
            senderId: null,
        });
        return true;
    });
}
const socketManager = (socket) => {
    socket.on("view_chat_list", (userId) => {
        console.log("view_chat_list", userId);
        getLatestMessages(userId)
            .then((res) => {
            console.log("success", res);
            socket.emit("chat_list", res);
        })
            .catch((err) => {
            console.log("error", err);
            socket.emit("chat_list", {
                status: "failed",
                message: "an error occurred!",
                error: err,
            });
        });
    });
    socket.on("enter_chat", ({ chatId, userId }) => {
        socket.join(chatId);
        getMessages(chatId, userId)
            .then((res) => {
            socket.emit("chats", res);
        })
            .catch((err) => {
            socket.emit("chats", JSON.stringify({
                status: "failed",
                message: "an error occurred!",
                error: err,
            }));
        });
        console.log(`user with id: ${socket.id} joined room ${chatId}`);
    });
    socket.on("send_message", (_a) => {
        var { chatId } = _a, data = __rest(_a, ["chatId"]);
        sendChat(data)
            .then((res) => {
            console.log(res);
            socket.to(chatId).emit("receive_message", res);
            socket.emit("receive_message", res);
        })
            .catch((err) => {
            console.log(err);
            socket.to(chatId).emit("receive_message", {
                status: "failed",
                message: "an error occurred!",
                error: err,
            });
        });
    });
    socket.on("delete_message", ({ id, userId, room, chatId, }) => {
        deleteMessage(id, userId, chatId)
            .then((res) => {
            socket.to(room).emit("update_messages", res);
        })
            .catch((err) => {
            socket.to(socket.id).emit(JSON.stringify({
                status: "failed",
                message: "an error occurred!",
                error: err,
            }));
        });
    });
    socket.on("message_read", ({ id, userId, room, chatId, }) => {
        markAsRead(id, chatId, userId)
            .then((res) => {
            socket.to(room).emit("update_messages", res);
        })
            .catch((err) => {
            socket.to(socket.id).emit(JSON.stringify({
                status: "failed",
                message: "an error occurred!",
                error: err,
            }));
        });
    });
    socket.on("disconnect", () => {
        console.log("user disconnected!");
    });
};
exports.socketManager = socketManager;
