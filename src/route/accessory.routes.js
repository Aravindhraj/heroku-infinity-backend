const accessoryController = require("../controller/accessory.controller");
const express = require("express");

const router = express.Router();

router.get("/all", accessoryController.getAccessories);
router.post("/getByIds", accessoryController.getAccessoriesByIds);
router.post(
  "/save",
  accessoryController.validate("saveAccessory"),
  accessoryController.saveAccessory
);
router.post("/delete", accessoryController.deleteAccessory);
router.get("/options", accessoryController.getAccessoriesOptions);

module.exports = router;
