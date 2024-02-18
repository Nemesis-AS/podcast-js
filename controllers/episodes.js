const addEpisode = (req, res) => {
    const data = req.body;
    if (!data || !data.id) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const db = req.app.get("db");
    db.run(
        "INSERT OR REPLACE INTO episodes VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
        [
            data.id,
            data.title || "",
            data.enclosureUrl || "",
            data.datePublished || 0,
            data.duration || 0,
            data.feedId || "",
            data.description || "",
            0,
        ],
        (err) => {
            if (err) {
                console.error(
                    "An Error Occurred while adding episode to the db!"
                );
                console.error(err);
                res.json({
                    success: false,
                    message: "Failed to add episode to the db!",
                });
                return;
            }
            console.log(`Added Episode ${data.id} to DB`);
            res.json({
                success: true,
                message: "Added episode successfully to the db!",
            });
        }
    );
};

const addEpObj = (db, data) => {
    db.run(
        "INSERT OR REPLACE INTO episodes VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
        [
            data.id,
            data.title || "",
            data.enclosureUrl || "",
            data.datePublished || 0,
            data.duration || 0,
            data.feedId || "",
            data.description || "",
            0,
        ],
        (err) => {
            if (err) {
                console.error(
                    "An Error Occurred while adding episode Obj to the db!"
                );
                console.error(err);
                return;
            }
            console.log(`Added Episode ${data.id} to DB`);
        }
    );
};

const addEpisodesByFeed = async (db, api, feedID) => {
    const res = await api.getEpisodesByFeedID(feedID);
    if (res.status == "true") {
        res.items.forEach((ep) => {
            addEpObj(db, ep);
        });
    }
};

const getEpisodesByFeed = (req, res) => {
    const data = req.params;
    if (!data || !data.id) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const db = req.app.get("db");
    db.all(
        "SELECT * FROM episodes WHERE feed = ?",
        [Number(data.id)],
        (err, row) => {
            if (err) {
                console.error(
                    "An error occurred while fetching episodes from the DB!\n",
                    err
                );
                res.json({ success: false, result: [] });
                return;
            }
            res.json({ success: true, result: row });
        }
    );
};

const deleteEpisode = (req, res) => {
    const data = req.params;
    if (!data || !data.id || !data.feedId) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const db = req.app.get("db");

    db.get("SELECT * FROM episodes WHERE id = ?", [data.id], (err, rows) => {
        if (err || !row.feed) {
            console.error(
                "An error occurred while removing episodes from DB!\n",
                err
            );
            res.json({ success: false, message: "An error occurred while removing episode from DB" });
            return;
        }

        db.run("DELETE FROM episodes WHERE id = ?", [data.id], (err) => {
            if (err) {
                console.error(
                    "An error occurred while removing episodes from DB!\n",
                    err
                );
                res.json({ success: false, message: "An error occurred while removing episode from DB" });
                return;
            }
    
            const downloader = req.app.get("downloader");
    
            const relPath = `${row.feed}/${data.id}`;
            downloader.deleteFile(relPath);
            res.json({ success: true, message: "Deleted episode successfully!" });
        });
    });
    
};

const downloadEpisode = (req, res) => {
    const data = req.params;
    if (!data || !data.id) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const db = req.app.get("db");
    db.get("SELECT id, link, feed FROM episodes WHERE id = ?", [Number(data.id)], (err, row) => {
        if (err) {
            console.error(
                "An error occurred while fetching episode from the DB!\n",
                err
            );
            res.json({ success: false});
            return;
        }
        
        const downloader = req.app.get("downloader");
        downloader.addToQueue(row.link, String(row.feed), String(row.id + ".mp3"), status => {
            setEpisodeDownloadStatus(db, row.id, status);
        });
        res.json({ success: true });

    });
};

const setEpisodeDownloadStatus = (db, id, status = true) => {
    const value = status ? "1" : "0";

    db.run("UPDATE episodes SET downloaded = ? WHERE id = ?", [value, id]);
};

const verifyEpisodes = (db, downloader) => {
    db.all("SELECT * FROM episodes", [], (err, rows) => {
        if (err) {
            console.error(
                "An error occurred while fetching episodes from the DB!\n",
                err
            );
            return;
        }
        
        rows.forEach(row => {
            const relPath = `${row.feed}/${row.id}`;
            
            if (downloader.fileExists(relPath)) {
                setEpisodeDownloadStatus(db, row.id, true);
            } else if(row.downloaded) {
                setEpisodeDownloadStatus(db, row.id, false);
            };
        });
    });
};

const verifyEpisodesByFeed = (req, res) => {
    const data = req.params;
    if (!data || !data.id) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const app = req.app;
    const db = app.get("db");
    const downloader = app.get("downloader");

    db.all("SELECT * FROM episodes where feed = ?", [data.id], (err, rows) => {
        if (err) {
            console.error(
                "An error occurred while fetching episodes from the DB!\n",
                err
            );
            res.send({ success: false, message: "An error occurred while fetching episodes from DB!" });
            return;
        }
        
        rows.forEach(row => {
            const relPath = `${row.feed}/${row.id}`;
            
            if (downloader.fileExists(relPath)) {
                setEpisodeDownloadStatus(db, row.id, true);
            } else if(row.downloaded) {
                setEpisodeDownloadStatus(db, row.id, false);
            };
        });
        res.send({ success: true });
    });
};

module.exports = {
    addEpisode,
    getEpisodesByFeed,
    addEpisodesByFeed,
    downloadEpisode,
    deleteEpisode,
    setEpisodeDownloadStatus,
    verifyEpisodes,
    verifyEpisodesByFeed,
};
