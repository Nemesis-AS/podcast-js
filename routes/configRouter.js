const express = require("express");
const router = express.Router();

const  { getConfig, saveConfig } = require("../controllers/config");

router.get("/", getConfig);
router.post("/", saveConfig);

module.exports = router;