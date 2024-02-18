const getConfig = (req, res) => {
    const config = req.app.get("config");
    if (!config) {
        res.json({ success: false, result: {} });
    }

    res.json({ success: true, result: config.getConfig() });
};

const saveConfig = (req, res) => {
    const data = req.body;
    if (!data || !data.config) {
        res.status(400).send("Invalid Request!");
        return;
    }

    const config = req.app.get("config");
    config.setConfig(data.config);
    config.saveConfig();

    res.json({ success: true, message: "Saved Config Successfully!" });
};

module.exports = {
    getConfig,
    saveConfig,
};