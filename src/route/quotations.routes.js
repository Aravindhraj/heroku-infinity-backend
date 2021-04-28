const quotationsController = require("../controller/quotations.controller");
const express = require("express");

const router = express.Router();

router.post("/all", quotationsController.getQuotations);
router.post(
  "/delete",
  quotationsController.validate("singleQuotation"),
  quotationsController.deleteQuotation
);
router.post(
  "/get",
  quotationsController.validate("singleQuotation"),
  quotationsController.getQuotationById
);
router.post(
  "/save",
  //quotationsController.validate("saveQuotation"),
  quotationsController.saveQuotation
);

module.exports = router;
