const router = require("express").Router();
const { PrismaClient } = require("../generated/prisma/");
const authMiddleware = require("../controllers/refresh-token");
const { successResponse } = require("../utils/response");
const prisma = new PrismaClient();

// NOTE: note tested
// for fetchig all messages in a chat between user and ownerId
const normalizeChatId = (uId, oId) => {
  const [a, b] = [Number(uId), Number(oId)].sort((x, y) => x - y);
  return `chat_${a}_${b}`;
};

router.get("/:userId/:ownerId", async (req, res, next) => {
  const { ownerId, userId } = req.params;
  try {
    // i don't know  do i need to change here
    // const chatId = `chat_${userId}_${ownerId}`;
    const chatId = normalizeChatId(userId, ownerId);
    const message = await prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: "asc" },
    });
    successResponse(
      res,
      { messages: message },
      "Chat fetched successfully",
      200,
    );
    console.log("M", message);
  } catch (error) {
    console.error("Error while fetching chat:", error);
    next(error);
  }
});

/*
 * I need to make this function
 */

// router.get("/partners", authMiddleware, async (req, res, next) => {

exports.getPartners = async (req, res, next) => {
  try {
    let userId = req.user?.id ?? req.body?.userId;
    userId = Number(userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderUserId: userId }, { receiverUserId: userId }],
      },
      select: {
        senderUser: { select: { id: true, name: true } },
        receiverUser: { select: { id: true, name: true } },
        senderOwner: { select: { id: true, name: true } },
        receiverOwner: { select: { id: true, name: true } },
      },
    });

    const partnersMap = new Map();

    for (const msg of messages) {
      const { senderUser, receiverUser, senderOwner, receiverOwner } = msg;

      // Current user sent the message
      if (senderUser && senderUser.id === userId) {
        if (receiverUser)
          partnersMap.set(`user-${receiverUser.id}`, {
            ...receiverUser,
            role: "USER",
          });
        if (receiverOwner)
          partnersMap.set(`owner-${receiverOwner.id}`, {
            ...receiverOwner,
            role: "OWNER",
          });
      }

      // Current user received the message
      if (receiverUser && receiverUser.id === userId) {
        if (senderUser)
          partnersMap.set(`user-${senderUser.id}`, {
            ...senderUser,
            role: "USER",
          });
        if (senderOwner)
          partnersMap.set(`owner-${senderOwner.id}`, {
            ...senderOwner,
            role: "OWNER",
          });
      }
    }

    const uniqueChatPartners = Array.from(partnersMap.values());

    if (uniqueChatPartners.length === 0) {
      return successResponse(
        res,
        { partners: [] },
        "No chat partners found",
        200,
      );
    }

    return successResponse(
      res,
      { partners: uniqueChatPartners },
      "Partners fetched successfully",
      200,
    );
  } catch (error) {
    console.error("Error while fetching partners:", error);
    next(error);
  }
};

router.get("/partners", authMiddleware, exports.getPartners);
router.get("/admin/partners", exports.getPartners);

router.get("/", async (req, res, next) => {
  res.status(200).json({
    message: "Welcome to the chat API",
  });
});

module.exports = router;
