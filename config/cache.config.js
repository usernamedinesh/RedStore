const { policies: CACHE_POLICIES } = require("./redisConfig");

module.exports = {
  getProductKey: (page, limit) =>
    `${CACHE_POLICIES.PRODUCTS.KEY_PREFIX}:page:${page}:limit:${limit}`,

  getProductTTL: () => CACHE_POLICIES.PRODUCTS.TTL,

  // Add other cache key generators as needed
  getSessionKey: (userId) => `${CACHE_POLICIES.SESSIONS.KEY_PREFIX}:${userId}`,
};
