const express = require("express");
const router = express.Router();
const consts = require("../consts");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: consts.Cache.Cache_TTL });
const reutersMapModel = require("../models/reutersMapModel");

/* GET home page. */
router.get("/all", async function (req, res, next) {
  const cacheKey = req.originalUrl.toLowerCase();
  const cachedResponse = await cache.get(cacheKey);
  if (cachedResponse) {
    console.log("Cached all reuters map");
    const cacheTTL = cache.getTtl(cacheKey);

    res.setHeader(consts.Headers.wasCached, 1);
    res.setHeader(consts.Headers.cacheTTL, consts.Cache.Cache_TTL);
    res.setHeader(
      consts.Headers.cachedAtTime,
      cacheTTL - consts.Cache.Cache_TTL * 1000
    );
    res.setHeader(consts.Headers.expiresAtTime, cacheTTL);

    return res.status(200).json(cachedResponse);
  }

  try {
    const data = await reutersMapModel.find({}, { _id: 0, __v: 0 });
    cache.set(cacheKey, data, consts.Cache.Cache_TTL);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
