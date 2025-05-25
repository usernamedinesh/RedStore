const cors = require("cors");

function corsMiddleware(req, res, next) {
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(req, res, next); // Call cors middleware function
}

module.exports = corsMiddleware;
