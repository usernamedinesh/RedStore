const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const { PrismaClient } = require("../generated/prisma");
const env = require("../config/envConfig");
const prisma = new PrismaClient();

// Passport JWT strategy configuration
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from Authorization header
  secretOrKey: env.JWT_SECRET, // Secret key to verify the JWT token
};

passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      // Correctly look up user in your DB
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id }, // Use a `where` clause to find the user
      });

      if (user) {
        return done(null, user); // Authentication successful
      } else {
        return done(null, false); // Authentication failed
      }
    } catch (error) {
      return done(error, false); // Error occurred during authentication
    }
  }),
);

module.exports = passport;
