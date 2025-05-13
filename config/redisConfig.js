const redis = require("redis");
const env = require("./envConfig");

const redisClient = redis.createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  // password: env.REDIS_PASSWORD,
  pingInterval: 10_000, // Keep connection alive
});

redisClient
  .on("connect", () => console.info("Redis connecting..."))
  .on("ready", () => console.info("Redis ready!"))
  .on("error", (err) => console.error("Redis error:", err));

// Connect immediately when imported
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

// Cache policies
const CACHE_POLICIES = {
  PRODUCTS: {
    TTL: 3600, // 1 hour
    KEY_PREFIX: "products",
  },
  SESSIONS: {
    TTL: 86400, // 24 hours
    KEY_PREFIX: "sessions",
  },
};

module.exports = {
  client: redisClient,
  policies: CACHE_POLICIES,
};
