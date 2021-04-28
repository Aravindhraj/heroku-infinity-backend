const serviceHistoryController = require("../controller/service-history.controller");
const express = require("express");

const router = express.Router();

router.post(
  "/save",
  //serviceHistoryController.validate("SaveServiceHistory"),
  serviceHistoryController.SaveServiceHistory
);

router.post(
  "/all",
  serviceHistoryController.fetchAll
);

router.post(
  "/cust-id",
  serviceHistoryController.fetchAll
)

router.post(
  "/get",
  //serviceHistoryController.validate("getServiceHistory"),
  serviceHistoryController.getServiceHistory
);

module.exports = router;
