import Comment from "../models/comment";
import { ApiFeaturesAggregation } from "../lib/utils/api-features";
import Chat from "../models/chat";
import { DefaultEventsMap, Socket } from "socket.io";
import mongoose from "mongoose";

const chatApiFeaturesAggregation = (
  query: Record<any, any>,
  senderQuery?: Record<string, any>
) => {
  return new ApiFeaturesAggregation(
    {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "senderDetails",
    },
    Comment,
    query,
    "$senderDetails",
    senderQuery
  );
};

const genereteChatId = (senderId: string, receiverId: string) => {
  return [senderId, receiverId].sort().join("-");
};
export async function sendChat(data: {
  message: string;
  senderId: string;
  receiverId: string;
  read?: boolean;
}) {
  const { senderId, receiverId, read } = data;
  const chatId = genereteChatId(senderId, receiverId);
  const newChat = await Chat.create({
    chatId,
    senderId,
    receiverId,
    message: data.message,
    read: data.read,
  });
  return newChat;
}
export async function markAsRead(id: string, chatId: string, userId: string) {
  await Chat.findByIdAndUpdate(id, {
    read: true,
  });
  return getMessages(chatId, userId);
}
export async function getMessage(id: string) {
  const chat = await Chat.findById(id);
  return chat;
}
export async function getMessages(chatId: string, userId: string) {
  const messages = await Chat.aggregate([
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
}
const getLatestMessages = async (userId: string) => {
  const id = new mongoose.Types.ObjectId(userId);
  const messages = await Chat.aggregate([
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
      $sort: { sentAt: -1 },
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
};

export async function getChats(userId: string) {
  const chats = await Chat.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).sort({ sentAt: -1 });

  return chats || [];
}

export async function deleteMessage(
  id: string,
  userId: string,
  chatId: string
) {
  await Chat.deleteOne({
    _id: id,
    senderId: userId,
  });
  return getMessages(chatId, userId);
}
export async function deleteChat(chatId: string, userId) {
  await Chat.updateMany(
    { chatId, receiverId: userId },
    {
      receiverId: null,
    }
  );
  await Chat.updateMany(
    { chatId, senderId: userId },
    {
      senderId: null,
    }
  );
  return true;
}

export const socketManager = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("view_chat_list", (userId: string) => {
    getLatestMessages(userId)
      .then((res) => {
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
  socket.on(
    "enter_chat",
    ({ chatId, userId }: { chatId: string; userId: string }) => {
      socket.join(chatId);
      getMessages(chatId, userId)
        .then((res) => {
          socket.emit("chats", res);
        })
        .catch((err) => {
          socket.emit(
            "chats",
            JSON.stringify({
              status: "failed",
              message: "an error occurred!",
              error: err,
            })
          );
        });
      console.log(`user with id: ${socket.id} joined room ${chatId}`);
    }
  );
  socket.on(
    "send_message",
    ({
      chatId,
      ...data
    }: {
      chatId: string;
      message: string;
      senderId: string;
      receiverId: string;
      read?: boolean;
      time: string;
    }) => {
      sendChat(data)
        .then((res) => {
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
          /* socket.emit("receive_message", {
            status: "failed",
            message: "an error occurred!",
            error: err,
          }); */
        });
    }
  );
  socket.on(
    "delete_message",
    ({
      id,
      userId,
      room,
      chatId,
    }: {
      id: string;
      userId: string;
      room: string;
      chatId: string;
    }) => {
      deleteMessage(id, userId, chatId)
        .then((res) => {
          socket.to(room).emit("update_messages", res);
        })
        .catch((err) => {
          socket.to(socket.id).emit(
            JSON.stringify({
              status: "failed",
              message: "an error occurred!",
              error: err,
            })
          );
        });
    }
  );
  socket.on(
    "message_read",
    ({
      id,
      userId,
      room,
      chatId,
    }: {
      id: string;
      userId: string;
      room: string;
      chatId: string;
    }) => {
      markAsRead(id, chatId, userId)
        .then((res) => {
          socket.to(room).emit("update_messages", res);
        })
        .catch((err) => {
          socket.to(socket.id).emit(
            JSON.stringify({
              status: "failed",
              message: "an error occurred!",
              error: err,
            })
          );
        });
    }
  );
  socket.on("disconnect", () => {
    console.log("user disconnected!");
  });
};
