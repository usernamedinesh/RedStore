const http = require("http");
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const productOwerRoute = require("./router/productOwer.route");
const userRoute = require("./router/user");
const adminRoute = require("./router/admin/user");
const adminProductRoute = require("./router/admin/productRoute");
const addressRoute = require("./router/order");
const cart = require("./router/admin/addTocart");
const productRoute = require("./router//product.route");
const rateLimiter = require("./middleware/rateLimiter");

const notFoundHandler = require("./middleware/notFound");
const corsMiddleware = require("./middleware/cors");
const bodyParser = require("body-parser");
const passport = require("./utils/passport");
const cookieParser = require("cookie-parser");

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/owner", productOwerRoute);
app.use("/api", userRoute, productRoute);
app.use("/api/user", addressRoute, cart);
app.use("/admin", adminRoute, adminProductRoute);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = http.createServer(app);
module.exports = { httpServer, app };
