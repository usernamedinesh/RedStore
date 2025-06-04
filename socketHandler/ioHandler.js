//i need httpServer here
const { Server } = require("http");
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

module.exports = io;
