const { Server } = require("socket.io");
const { httpServer } = require("../app");
const env = require("../config/envConfig");
const { PrismaClient } = require("../generated/prisma/");
const { successResponse } = require("../utils/response");
const prisma = new PrismaClient();
const router = require("express").Router();

const io = new Server(httpServer, {
  pingTimeout: 6000,
  cors: {
    // origin: env.ORIGIN,
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const getChatRoomId = (userId, ownerId) => {
  return `chat_${Math.min(userId, ownerId)}_${Math.max(userId, ownerId)}`;
};

const initSocket = () => {
  console.log("Socket.io initialized");

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("joinRoom", ({ userId, ownerId }) => {
      const roomId = getChatRoomId(userId, ownerId);
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room: ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      const {
        content,
        type,
        userId,
        ownerId,
        fileUrl = null,
        senderType,
      } = data;
      const roomId = getChatRoomId(userId, ownerId);

      try {
        const messageData = {
          text: type === "TEXT" ? content : null,
          fileUrl: type === "FILE" ? fileUrl : null,
          type,
          chatId: roomId,
        };

        if (senderType === "USER") {
          messageData.senderUserId = userId;
          messageData.receiverOwnerId = ownerId;
        } else if (senderType === "OWNER") {
          messageData.senderOwnerId = ownerId;
          messageData.receiverUserId = userId;
        } else {
          throw new Error("Invalid senderType. Must be 'USER' or 'OWNER'");
        }

        const message = await prisma.message.create({ data: messageData });

        io.to(roomId).emit("receiveMessage", message);
      } catch (error) {
        console.error("Error saving message to database:", error);
        socket.emit("error", {
          message: "Failed to send message. Please try again later.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { io, initSocket, router };
