const rolePerController = require("../controller/role-permission.controller");
const express = require("express");

const router = express.Router();

router.get("/all", rolePerController.getPermissions);

module.exports = router;
