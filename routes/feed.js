const express = require("express");
const router = express.Router();
const consts = require("../consts");
const feedGenerator = require("../util/feedGenerator");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: consts.Cache.Cache_TTL });

/* GET home page. */
router.get("/all", async function (req, res, next) {
  const cacheKey = req.originalUrl.toLowerCase();
  const cachedResponse = await cache.get(cacheKey);
  if (cachedResponse) {
    console.log("Cached all feed");
    res.setHeader("Cache-control", `public, max-age=${consts.Cache.Cache_TTL}`);
    return res.status(200).json(cachedResponse);
  }

  try {
    const data = await feedGenerator.generateFeed();
    cache.set(cacheKey, data, consts.Cache.Cache_TTL);
    res.setHeader("Cache-control", `public, max-age=${consts.Cache.Cache_TTL}`);
    res.setHeader("Cache-Control", "must-revalidate");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
