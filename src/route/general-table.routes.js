const generalController = require("../controller/general-table.controller");
const express = require("express");

// module.exports = { router };
module.exports = (model) => {
  const router = express.Router();

  router.get("/all", (req, res) => generalController.getAll(req, res, model));
  router.post("/save", generalController.validate("save", model), (req, res) =>
    generalController.saveRecord(req, res, model)
  );
  router.post("/delete", (req, res) =>
    generalController.deleteRecord(req, res, model)
  );
  router.get("/options", (req, res) =>
    generalController.getOptions(req, res, model)
  );
  return router;
};
