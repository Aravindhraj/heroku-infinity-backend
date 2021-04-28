const financeController = require("../controller/finance.controller");
const express = require("express");

const router = express.Router();

router.get(
  "/all",
  financeController.getFinances
);
router.post(
  "/get",
  financeController.getById
);
router.post(
  "/save",
  financeController.validate("saveFinance"),
  financeController.saveFinance
);
router.post(
  "/delete",
  financeController.validate("deleteFinance"),
  financeController.deleteFinance
);
router.get(
  "/active",
  financeController.getActiveFinances
);
module.exports = router;
