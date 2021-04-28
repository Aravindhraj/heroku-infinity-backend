const serviceScheduleController = require("../controller/service-schedule.controller");
const express = require("express");

const router = express.Router();

router.post(
  "/save",
  //serviceScheduleController.validate("SaveserviceSchedule"),
  serviceScheduleController.SaveServiceSchedule
);

router.post(
  "/all",
  serviceScheduleController.fetchAll
);

router.post(
  "/cust-id",
  serviceScheduleController.fetchAll
)

router.post(
  "/get",
  //serviceScheduleController.validate("getserviceSchedule"),
  serviceScheduleController.getServiceSchedule
);

module.exports = router;
