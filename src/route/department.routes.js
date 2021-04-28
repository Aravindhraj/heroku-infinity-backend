const departmentController = require("../controller/department.controller");
const express = require("express");

const router = express.Router();

router.get("/all", departmentController.getDepartments);
router.post(
  "/save",
  departmentController.validate("saveDepartment"),
  departmentController.saveDepartment
);
router.post("/delete", departmentController.deleteDepartment);
router.get("/active", departmentController.getActiveDepartments);


module.exports = router;
