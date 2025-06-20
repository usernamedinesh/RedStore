const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/generateToken"); // adjust path
const env = require("../config/envConfig");
const { PrismaClient } = require("../generated/prisma"); // adjust to your prisma client path
const { successResponse } = require("../utils/response");
const prisma = new PrismaClient();

/*
 *
 * if the token valid then u can access the route freely
 * if the token is expired then it will try to create new
 * accessToken using the refreshToken
 * REFRESHTOKEN will be sended in the cookies when
 * user is login in or singup  or register
 * so send the cookies  when u fetch an api call
 */

const authenticateJwtWithAutoRefresh = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;

  if (!authHeader) {
    return successResponse(res, null, "No auth token", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return successResponse(res, null, "Malformed auth token", 401);
  }
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return successResponse(
            res,
            null,
            "Access token expired. Refresh token missing.",
            401,
          );
        }

        try {
          const refreshDecoded = jwt.verify(
            refreshToken,
            env.REFRESH_TOKEN_SECRET,
          );
          if (!refreshDecoded || !refreshDecoded.id) {
            return successResponse(res, null, "Invalid refresh token", 403);
          }
          const user = await prisma.user.findFirst({
            where: { id: Number(refreshDecoded.id) },
            select: {
              id: true,
              email: true,
              name: true,
              refreshToken: true,
            },
          });
          if (!user || user.refreshToken !== refreshToken) {
            return successResponse(
              res,
              null,
              "Refresh token not recognized",
              403,
            );
          }

          const newAccessToken = generateAccessToken(user);

          res.setHeader("Access-Control-Expose-Headers", "x-access-token");
          res.setHeader("x-access-token", newAccessToken);
          console.log("sended new access token");
          // res.status(200).json({
          //   message: "Token refreshed",
          //   accessToken: newAccessToken,
          // });
          req.user = user;
          return next();
        } catch (refreshErr) {
          if (refreshErr.name === "TokenExpiredError") {
            res.clearCookie("refreshToken", {
              httpOnly: true,
              sameSite: "Strict",
              secure: true,
            });
            return successResponse(
              res,
              null,
              "Session expired. Please log in again.",
              401,
            );
          }
          return successResponse(res, null, "Invalid refresh token", 403);
        }
      } else {
        return successResponse(res, null, "Unauthorized", 401);
      }
    } else {
      req.user = decoded;
      return next();
    }
  });
};

module.exports = authenticateJwtWithAutoRefresh;
