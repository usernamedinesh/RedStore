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

const initSocket = () => {
  console.log("Socket.io initialized");

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // join an specific room
    socket.on("joinRoom", ({ userId, ownerId }) => {
      const roomId = `chat_${userId}_${ownerId}`;
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room: ${roomId}`);
    });

    // user send an message
    socket.on("sendMessage", async (data) => {
      const { content, type, userId, ownerId, fileUrl = null } = data;
      const roomId = `chat_${userId}_${ownerId}`;

      try {
        //save in db
        const message = await prisma.message.create({
          data: {
            text: type === "TEXT" ? content : null,
            fileUrl: type === "FILE" ? fileUrl : null,
            type,
            senderUserId: userId,
            senderOwnerId: ownerId,
            chatId: roomId, // NOTE: not migrated  in db right now
          },
        });
        io.to(roomId).emit("receiveMessage", message);
      } catch (error) {
        console.error("Error saving message to database:", error);
        socket.emit("errro", {
          message: "Failed to send message. Please try again later.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Add more socket event listeners here if needed
  });
};

module.exports = { io, initSocket, router };
