const cors = require("cors");

function corsMiddleware(req, res, next) {
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(req, res, next); // Call cors middleware function
}

module.exports = corsMiddleware;
