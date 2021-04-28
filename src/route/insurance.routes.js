const insuranceController = require("../controller/insurance.controller");
const express = require("express");

const router = express.Router();

router.get(
  "/all",
  insuranceController.getInsurances
);
router.post(
  "/get",
  insuranceController.getById
);
router.post(
  "/save",
  insuranceController.validate("saveInsurance"),
  insuranceController.saveInsurance
);
router.post(
  "/delete",
  insuranceController.validate("deleteInsurance"),
  insuranceController.deleteInsurance
);
module.exports = router;
