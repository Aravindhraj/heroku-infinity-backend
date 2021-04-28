const express = require("express");

const router = express.Router();

router.use(
  "/colors",
  require("./general-table.routes")("Colors")
);

router.use(
  "/varients",
  require("./general-table.routes")("Varients")
);

router.use(
  "/payment-types",
  require("./general-table.routes")("PaymentTypes")
);

router.use(
  "/enquiry-types",
  require("./general-table.routes")("EnquiryTypes")
);

router.use(
  "/lead-types",
  require("./general-table.routes")("LeadTypes")
);

router.use(
  "/lead-categories",
  require("./general-table.routes")("LeadCategories")
);

router.use(
  "/spare-parts",
  require("./general-table.routes")("SpareParts")
);

module.exports = router;
