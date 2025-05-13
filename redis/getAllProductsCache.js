const redis = require("redis");
const client = redis.createClient();

exports.productsCache = async (req, res, next) => {
  const key = `products:${req.query.page}:${req.query.limit}`;

  client.get(key, (err, data) => {
    if (err) {
      console.error("Redis error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(data));
    } else {
      console.log("Cache miss");
      next();
    }
  });
};
