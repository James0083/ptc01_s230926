const express = require("express");
const router = express.Router();
const ptc01_Controller = require("../controllers/ptc01_Controller");

router.get("/:res_mode", ptc01_Controller.getAllCandles);

router.get("/:res_mode/:start_time/:end_time", ptc01_Controller.getRangeCandle);

module.exports = router;