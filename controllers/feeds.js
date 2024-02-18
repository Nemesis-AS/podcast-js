const { addEpisodesByFeed } = require("./episodes");

const addFeed = (req, res) => {
    const data = req.body;
    if (!data || !data.id) {
        res.status(400).send("Malformed Request!");
        return;
    }

    const db = req.app.get("db");
    db.run(
        "INSERT OR REPLACE INTO feeds VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            data.id,
            data.title || "",
            data.url || "",
            data.link || "",
            data.author || "",
            data.image || "",
            data.episodeCount || "",
            data.description || "",
            (data.tags && JSON.stringify(data.tags)) || "",
        ],
        (err) => {
            if (err) {
                console.error("An Error Occurred while adding feed to the db!");
                console.error(err);
                res.json({
                    success: false,
                    message: "Failed to add feed to the db!",
                });
                return;
            }
            console.log(`Added Feed ${data.id} to DB`);
            const api = req.app.get("api");
            addEpisodesByFeed(db, api, data.id);
            res.json({
                success: true,
                message: "Added feed successfully to the db!",
            });
        }
    );
};

const removeFeed = (req, res) => {
    const data = req.params;
    if (!data || !data.id) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const db = req.app.get("db");
    db.run("DELETE FROM feeds WHERE id = ?", [data.id], (err) => {
        if (err) {
            res.send({ success: false, message: "An error occurred while deleting feed from DB!" });
            console.log("An error occurred while deleting feed from DB!\n", err);
            return;
        }

        db.run("DELETE FROM episodes WHERE feed = ?", [data.id], (err) => {
            if (err) {
                res.send({ success: false, message: "An error occurred while deleting episodes from DB!" });
                console.log("An error occurred while deleting episodes from DB!\n", err);
                return;
            }

            const downloader = req.app.get("downloader");
            downloader.deleteDir(data.id);
            res.send({ success: true, message: "Removed feed successfully!" });
        });
    });
};

const getAllFeeds = (req, res) => {
    const db = req.app.get("db");
    db.all("SELECT * FROM feeds", [], (err, rows) => {
        if (err) {
            console.error(
                "An error occurred while fetching feeds from the DB!\n",
                err
            );
            res.json({ success: false, result: [] });
            return;
        }
        res.json({ success: true, result: rows });
    });
};

const getFeedByID = (req, res) => {
    const data = req.params;
    if (!data || !data.id) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const db = req.app.get("db");
    db.get(
        "SELECT * FROM feeds WHERE id = ?",
        [Number(data.id)],
        (err, row) => {
            if (err) {
                console.error(
                    "An error occurred while fetching feed from the DB!\n",
                    err
                );
                res.json({ success: false, result: {} });
                return;
            }
            res.json({ success: true, result: row || {} });
        }
    );
};

const getRemoteFeedsByTerm = async (req, res) => {
    const data = req.params;
    if (!data || !data.term) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const api = req.app.get("api");
    const remoteRes = await api.getFeedsByTerm(data.term);

    if (!remoteRes.status) {
        res.json({
            status: false,
            result: [],
        });
    }

    res.send({
        status: true,
        result: remoteRes.feeds,
    });
};

module.exports = {
    addFeed,
    removeFeed,
    getAllFeeds,
    getFeedByID,
    getRemoteFeedsByTerm,
};
