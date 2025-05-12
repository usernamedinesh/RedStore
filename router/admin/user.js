/* ADMIN */
const router = require("express").Router();
const { getAllUserByAdmin } = require("../../adminControllers/user/getAllUser");
const { SingleUserById } = require("../../adminControllers/user/getSigleUser");
const authMiddleware = require("../../controllers/refresh-token");

router.get("/user", authMiddleware, getAllUserByAdmin);
router.get("/user/:id", authMiddleware, SingleUserById);

module.exports = router;
