const express = require("express");
const router = express.Router();

const {
    addFeed,
    getAllFeeds,
    getFeedByID,
    getRemoteFeedsByTerm,
    removeFeed,
} = require("../controllers/feeds");
const {
    getEpisodesByFeed,
    verifyEpisodesByFeed,
} = require("../controllers/episodes");

router.get("/all", getAllFeeds);
router.get("/remote/byterm/:term", getRemoteFeedsByTerm);
router.get("/:id", getFeedByID);
router.get("/:id/episodes", getEpisodesByFeed);
router.get("/:id/verify", verifyEpisodesByFeed);
router.get("/:id/remove", removeFeed);
router.post("/add", addFeed);

module.exports = router;
