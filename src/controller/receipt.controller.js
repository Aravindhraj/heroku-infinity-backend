const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { upload } = require("../helpers/upload.helper");
const { idExists } = require("../helpers/validator.helper");
const { getUniqueId } = require("../helpers/general.helper");

exports.validate = (method) => {
  switch (method) {
    case "singleReceipt":
      return [
        body("id")
          .notEmpty()
          .withMessage("Receipt doest Not Exists")
          .bail()
          .custom((value) => idExists(value, "Receipts")),
      ];
    case "saveReceipt":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Receipts"))
          .withMessage("Receipt doest Not Exists"),
        body("name").notEmpty().withMessage("Enter Name"),
        body("amount").notEmpty().withMessage("Enter Amount"),
      ];
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const { start, perPage, sortBy, sortMode, search } = req.body;
    const receipts = await db.Receipts.findAll({
      attributes: [
        "id",
        "receipt_number",
        "name",
        "contact",
        "address",
        "amount",
        "payment_date",
        "card_number",
        "bank_name",
        "branch_name",
        "createdAt",
      ],
      order: [[sortBy, sortMode.toUpperCase()]],
      limit: perPage,
      offset: (start - 1) * perPage,
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });
    const total = await db.Receipts.count({
      order: [[sortBy, sortMode.toUpperCase()]],
      limit: perPage,
      offset: (start - 1) * perPage,
    });
    return apiSuccess(res, { records: receipts, total: total });
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true);
    }
    const Receipt = await db.Receipts.findOne({
      where: {
        id: req.body.id,
      },
    });
    return apiSuccess(res, Receipt);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Receipts.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true);
    }

    const { id } = req.body;

    let message = "";
    if (id) {
      // update
      Receipt = await db.Receipts.findByPk(id);
      Receipt.update(req.body);
      message = "Updated Successfully";
    } else {
      // create
      const receipt = await db.Receipts.create(req.body);
      const uniqueId = getUniqueId("RKTVSRE", receipt["id"]);
      receipt.update({ receipt_number: uniqueId });
      message = "Saved Successfully";
    }
    return apiSuccess(res, "success", message, true);
  } catch (error) {
    return apiError(res, error.message);
  }
};
