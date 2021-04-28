const receiptController = require("../controller/receipt.controller");
const express = require("express");

const router = express.Router();

router.post("/all", receiptController.getReceipts);
router.post(
  "/delete",
  receiptController.validate("singleReceipt"),
  receiptController.deleteReceipt
);
router.post(
  "/get",
  receiptController.validate("singleReceipt"),
  receiptController.getReceiptById
);
router.post(
  "/save",
  receiptController.validate("saveReceipt"),
  receiptController.saveReceipt
);

module.exports = router;
