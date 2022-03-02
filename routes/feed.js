const express = require("express");
const router = express.Router();
const consts = require("../consts");
const feedGenerator = require("../util/feedGenerator");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: consts.Cache.Cache_TTL });

/* GET home page. */
router.get("/all", async function (req, res, next) {
  if (await cache.get(req.originalUrl.toLowerCase())) {
    console.log("Cached all feed");
    return res.status(200).json(cache.get(req.originalUrl.toLowerCase()));
  }

  try {
    const data = await feedGenerator.generateFeed();
    cache.set(req.originalUrl.toLowerCase(), data, consts.Cache.Cache_TTL);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
