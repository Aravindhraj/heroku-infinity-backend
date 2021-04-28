const leadController = require("../controller/sales-lead.controller");
const express = require("express");

const router = express.Router();

router.post(
  "/save",
  leadController.validate("SaveLead"),
  leadController.SaveLead
);

router.post(
  "/all",
  leadController.fetchAll
);

router.post(
  "/get",
  leadController.validate("getLead"),
  leadController.getLead
)

module.exports = router;
