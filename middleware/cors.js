const cors = require("cors");

function corsMiddleware(req, res, next) {
  cors({
    origin: "http://localhost:3000", // restrict calls to this address
    methods: "GET", // only allow GET requests
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept", // allowed headers
  })(req, res, next); // Call cors middleware function
}

module.exports = corsMiddleware;
