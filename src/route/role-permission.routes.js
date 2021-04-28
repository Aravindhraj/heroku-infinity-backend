const rolePerController = require("../controller/role-permission.controller");
const express = require("express");

const router = express.Router();

router.get("/all", rolePerController.getRoles);
router.post("/get", rolePerController.getRoleById);
router.post(
  "/edit",
  rolePerController.validate("editRole"),
  rolePerController.editRole
);

module.exports = router;
