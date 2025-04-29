const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const userRoute = require("./router/user");
const notFoundHandler = require("./middleware/notFound");
const corsMiddleware = require("./middleware/cors");
const bodyParser = require("body-parser");
const passport = require("./utils/passport");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Use passport middleware
app.use(passport.initialize());
app.use(corsMiddleware);

app.use("/api", userRoute);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
