const express = require("express");
const passport = require("passport");
const router = express.Router();

require("../auth/auth");
require("./auth.routes")(router);

const authMiddleware = passport.authenticate("jwt", { session: false });

router.get("/", passport.authenticate("jwt", { session: false }), function (
  req,
  res,
  next
) {
  res.status(200).json({ message: "working" });
});
router.use("/users", authMiddleware, require("./user.routes"));
router.use("/roles", authMiddleware, require("./role-permission.routes"));
router.use("/permissions", authMiddleware, require("./permission.routes"));
router.use("/categories", authMiddleware, require("./category.routes"));
router.use("/subcategories", authMiddleware, require("./subcategory.routes"));
router.use("/insurance", authMiddleware, require("./insurance.routes"));
router.use("/finance", authMiddleware, require("./finance.routes"));
router.use("/products", authMiddleware, require("./product.routes"));
router.use("/department", authMiddleware, require("./department.routes"));
router.use("/enquiry", authMiddleware, require("./enquiry.routes"));
router.use("/sales-lead", authMiddleware, require("./sales-lead.routes"));
router.use("/accessories", authMiddleware, require("./accessory.routes"));
router.use("/table", authMiddleware, require("./table.route"));
router.use("/service-history", authMiddleware, require("./service-history.routes"));
router.use("/service-schedule", authMiddleware, require("./service-schedule.routes"));
router.use("/purchases", authMiddleware, require("./purchases.routes"));

router.use("/dashboard", authMiddleware, require("./dashboard.routes"));
router.use("/receipts", authMiddleware, require("./receipt.routes"));
router.use("/quotations", authMiddleware, require("./quotations.routes"));

module.exports = router;
