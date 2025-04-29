const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const { PrismaClient } = require("../generated/prisma");
const env = require("../config/envConfig");
const prisma = new PrismaClient();

// Passport JWT strategy configuration

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.ACCESS_TOKEN_SECRET,
    },
    async (jwt_payload, done) => {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });
      return user ? done(null, user) : done(null, false);
    },
  ),
);

module.exports = passport;
