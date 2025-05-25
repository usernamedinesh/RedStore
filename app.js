const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const productOwerRoute = require("./router/productOwer.route");
const userRoute = require("./router/user");
const adminRoute = require("./router/admin/user");
const adminProductRoute = require("./router/admin/productRoute");
const addressRoute = require("./router/order");
const adminCart = require("./router/admin/addTocart");
const productRoute = require("./router//product.route");

const notFoundHandler = require("./middleware/notFound");
const corsMiddleware = require("./middleware/cors");
const bodyParser = require("body-parser");
const passport = require("./utils/passport");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(corsMiddleware);

app.use("/owner", productOwerRoute);
app.use("/api", userRoute, productRoute);
app.use("/api/user", addressRoute);
app.use("/admin", adminRoute, adminProductRoute, adminCart);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
