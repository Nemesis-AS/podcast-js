const fs = require("fs");

class Config {
    constructor(filepath) {
        this.configPath = filepath;
        this.options = {};

        this.loadConfig(filepath);
    }

    loadConfig() {
        if (!fs.existsSync(this.configPath)) {
            this.saveConfig();
            return;
        }


        const data = fs.readFileSync(this.configPath, { encoding: "utf-8" });
        this.options = JSON.parse(data);
    };

    keyExists(key) {
        return !(this.options[key] === undefined);
    }

    getConfig() {
        return this.options;
    }

    getValue(key) {
        if (!this.keyExists(key))
            return null;
        return this.options[key];
    }

    setValue(key, value) {
        this.options[key] = value;
    }

    setConfig(config) {
        this.options = config;
    }

    saveConfig() {
        const data = JSON.stringify(this.options, null, 4);
        fs.writeFileSync(this.configPath, data, { encoding: "utf-8" });
    }
}

module.exports = Config;