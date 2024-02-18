const sqlite3 = require("sqlite3").verbose();

const setupDB = () => {
    const db = new sqlite3.Database("./db.sqlite3", (err) => {
        if (err) {
            console.error("Could not connect to SQLITE Database!");
            console.error(err);
            return;
        }

        console.log("Connected to SQLITE Database successfully!");

        db.run(
            "CREATE TABLE IF NOT EXISTS feeds(id INTEGER PRIMARY KEY, title TEXT, url TEXT, link TEXT, author TEXT, image TEXT, episodeCount INT, description TEXT, tags TEXT)"
        );
        db.run(
            "CREATE TABLE IF NOT EXISTS episodes(id INTEGER PRIMARY KEY, title TEXT, link TEXT, publish_date INTEGER, duration INTEGER, feed INTEGER, description TEXT, downloaded INT)"
        );
    });

    return db;
};

module.exports = {
    setupDB,
};
