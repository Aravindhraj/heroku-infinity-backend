const purchasesController = require("../controller/purchases.controller");
const express = require("express");

const router = express.Router();

router.post(
  "/save",
  //serviceScheduleController.validate("SaveserviceSchedule"),
  purchasesController.SavePurchase
);

router.post(
  "/all",
  purchasesController.fetchAll
);

router.post(
  "/cust-id",
  purchasesController.fetchAll
)

router.post(
  "/get",
  //serviceScheduleController.validate("getserviceSchedule"),
  purchasesController.getPurchase
);

router.post(
  "/recent",
  //serviceScheduleController.validate("getserviceSchedule"),
  purchasesController.fetchRecentPurchase
);

module.exports = router;
