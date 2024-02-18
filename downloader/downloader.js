const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { finished } = require("stream/promises");

class Downloader {
    constructor(basePath) {
        this.basePath = basePath;
        this.queue = [];
        this.current = null;

        if (!fs.existsSync(this.basePath))
            fs.mkdir(this.basePath, { recursive: true }, err => {
                if (err) 
                    console.log("An error occurred while creating download directory!\n", err);
            });
    }

    addToQueue(url, savePath, filename, callback) {
        if (!url || !savePath || !filename || !callback) {
            console.log(`Invalid Arguments!\n{\n\turl: ${url},\n\tsavePath: ${savePath},\n\tfilename: ${filename}\n\callback: ${callback}\n}`);
            return;
        }

        this.queue.push({ url, savePath, filename, callback });
        if (!this.current) {
            this.download();
        }
    }

    async download() {
        if (this.queue.length === 0)
            return;

        this.current = this.queue.shift();

        const dest = path.resolve(this.basePath, this.current.savePath);
        if(!fs.existsSync(dest))
            fs.mkdir(dest, { recursive: true }, err => {
                if (err) 
                    console.log("An error occurred while creating download directory!\n", err);
            });

        const destPath = path.resolve(dest, this.current.filename);
        console.log(`Downloading file ${this.current.filename}...`);

        if (!fs.existsSync(destPath)) {
            const res = await fetch(this.current.url);
            const fileStream = fs.createWriteStream(destPath, { flags: "wx" });
            await finished(Readable.fromWeb(res.body).pipe(fileStream));
            console.log(`Downloaded file ${this.current.filename}!`);
            this.current.callback(true);
        } else {
            console.log("File Already Exists! Skipping!");
            this.current.callback(true);
        }

        this.current = null;
        this.download();
    }

    fileExists(relPath) {
        const fullPath = path.join(this.basePath, relPath + ".mp3");
        return fs.existsSync(fullPath);
    }

    deleteDir(relPath) {
        const fullPath = path.join(this.basePath, relPath);
        if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath, { recursive: true });
        }
    }

    deleteFile(relPath) {
        const fullPath = path.join(this.basePath, relPath + ".mp3");
        if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath);
        }
    }
}

module.exports = Downloader;