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
    res.setHeader("Cache-control", `public, max-age=${consts.Cache.Cache_TTL}`);
    return res.status(200).json(cachedResponse);
  }

  try {
    let data = await reutersMapModel
      .find({}, { _id: 0, __v: 0 })
      .sort({ epochTime: -1 });
    const responseData = { mapData: data, GhostOfKiev: "🚜&✈️" };
    cache.set(cacheKey, responseData, consts.Cache.Cache_TTL);
    res.setHeader("Cache-control", `public, max-age=${consts.Cache.Cache_TTL}`);
    res.setHeader("Cache-Control", "must-revalidate");
    return res.status(200).json(responseData);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
