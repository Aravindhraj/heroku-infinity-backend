const userController = require("../controller/user.controller");
const express = require("express");
const { route } = require("./role-permission.routes");

const router = express.Router();

router.get("/testMessage", userController.testMessage);

router.get("/all", userController.getUsers);
router.post(
  "/get",
  userController.validate("getUserById"),
  userController.getUserById
);
router.post(
  "/save",
  userController.validate("saveUser"),
  userController.saveUser
);
router.post(
  "/delete",
  userController.validate("deleteUser"),
  userController.deleteUser
);

router.get(
  "/sales-person",
  userController.fetchSalesPerson
)

// router.get(
//   "/customers",
//   userController.fetchCustomers
// )

// router.get(
//   "/service-person",
//   userController.fetchServicePerson
// )

router.post(
  "/get-by-type",
  userController.fetchUsersByType
)



module.exports = router;
