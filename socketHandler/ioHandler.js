const { Server } = require("socket.io");
const { httpServer } = require("../app");
const env = require("../config/envConfig");

const io = new Server(httpServer, {
  pingTimeout: 6000,
  cors: {
    origin: env.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const initSocket = () => {
  console.log("Socket.io initialized");

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Add more socket event listeners here if needed
  });
};

module.exports = { io, initSocket };
