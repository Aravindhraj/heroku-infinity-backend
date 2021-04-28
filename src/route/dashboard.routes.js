const dashboardController = require("../controller/dashboard.controller");
const express = require("express");
const router = express.Router();

router.get("/counters", dashboardController.getCounters);
module.exports = router;
