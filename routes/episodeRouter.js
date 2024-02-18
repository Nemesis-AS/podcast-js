const express = require("express");
const router = express.Router();

const { downloadEpisode, verifyEpisodes } = require("../controllers/episodes");

router.get("/download/:id", downloadEpisode);
router.get("/test", (req, res) => {
    const db = req.app.get("db");
    const downloader = req.app.get("downloader");
    verifyEpisodes(db, downloader);

    res.sendStatus(200);
});


module.exports = router;