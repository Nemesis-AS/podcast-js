const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

const PodcastIndexAPI = require("./api/podcastIndex");
const Downloader = require("./downloader/downloader");
const Config =  require("./config");

const { setupDB } = require("./setup");
const feedRouter = require("./routes/feedRouter");
const episodeRouter = require("./routes/episodeRouter");
const configRouter = require("./routes/configRouter");
const { verifyEpisodes } = require("./controllers/episodes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).sendFile("./static/index.html", { root: "." });
});

app.use("/api/v1/feeds", feedRouter);
app.use("/api/v1/episodes", episodeRouter);
app.use("/api/v1/config", configRouter);

app.get("*", (req, res) => {
    res.status(404).json({
        status: false,
        message: "Nothing to see here...",
    });
});

const config = new Config("./config.json");
app.set("config", config);

const db = setupDB();
app.set("db", db);

const downloader = new Downloader(config.getValue("download_dir") && "D:/Temporary/Podcasts");
app.set("downloader", downloader);

const api = new PodcastIndexAPI(
    process.env.API_KEY,
    process.env.API_SECRET,
    process.env.API_BASE_PATH
);
app.set("api", api);

verifyEpisodes(db, downloader);

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
