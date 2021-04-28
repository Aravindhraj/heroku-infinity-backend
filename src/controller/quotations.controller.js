const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { upload } = require("../helpers/upload.helper");
const { idExists } = require("../helpers/validator.helper");
const { getUniqueId } = require("../helpers/general.helper");

exports.validate = (method) => {
  switch (method) {
    case "singleQuotation":
      return [
        body("id")
          .notEmpty()
          .withMessage("Quotation doest Not Exists")
          .bail()
          .custom((value) => idExists(value, "Quotations")),
      ];
    case "saveQuotation":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Quotations"))
          .withMessage("Quotation doest Not Exists"),
        body("name").notEmpty().withMessage("Enter Name"),
        body("amount").notEmpty().withMessage("Enter Amount"),
      ];
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const { start, perPage, sortBy, sortMode, search } = req.body;
    const quotations = await db.Quotations.findAll({
      attributes: [
        "id",
        "quotation_number",
        "name",
        "phone",
        "address",
        "product_id",
        "accessories",
        "old_vehicle_name",
        "old_vehicle_cost",
        "createdAt",
      ],
      include: [{
        model: db.Products,
        as: "product_data",
        attributes: ["id", "name"],
        include: {
          model: db.Varients,
          as: "varients",
          attributes: ["id", "name"],
        },
      },],
      order: [[sortBy, sortMode.toUpperCase()]],
      limit: perPage,
      offset: (start - 1) * perPage,
      where: {
        [Op.or]: [{
          name: {
            [Op.like]: `%${search}%`,
          }
        },
        {
          "$product_data.name$": {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$product_data.varients.name$": {
            [Op.like]: `%${search}%`,
          },
        },
        {
          quotation_number: {
            [Op.like]: `%${search}%`,
          }
        },]
      },
    });
    const total = await db.Quotations.count({
      order: [[sortBy, sortMode.toUpperCase()]],
      limit: perPage,
      offset: (start - 1) * perPage,
    });
    return apiSuccess(res, { records: quotations, total: total });
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true);
    }
    var Quotation = await db.Quotations.findOne({
      where: {
        id: req.body.id,
      },
      include: [{
        model: db.Products,
        as: "product_data",
        attributes: ["id", "name", "vehicle_cost", "road_tax_cost", "insurance_cost", "reg_handling_cost", "total_sales_price"],
        include: [{
          model: db.Varients,
          as: "varients",
          attributes: ["id", "name"],
        }]
      },
      {
        model: db.User,
        as: "sales_person_data",
        attributes: ["id", "firstname", "lastname"]
      }]
    });

    console.log("res");
    console.log(Quotation.accessories);

    const accessories_data = await db.Accessories.findAll({
      attributes: ["id", "name", "price", "status"],
      where: {
        id: Quotation.accessories.split(",")
      }
    });

    var accessories_total_price = 0;

    accessories_data.forEach(element => {
      accessories_total_price += element.price;
    });

    Quotation.setDataValue("accessories_data", accessories_data);
    Quotation.setDataValue("accessories_total_price", accessories_total_price);

    return apiSuccess(res, Quotation);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Quotations.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveQuotation = async (req, res) => {
  try {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return apiError(res, errors.array(), true);
    // }

    const { id } = req.body;

    const data = req.body;
    if (data["sales_person"]) {
      data["sales_person"] = JSON.parse(data["sales_person"]);
      data["sales_person_id"] = data["sales_person"]["id"];
    }

    let message = "";
    if (id) {
      // update
      Quotation = await db.Quotations.findByPk(id);
      Quotation.update(data);
      message = "Updated Successfully";
    } else {
      // create
      const quotation = await db.Quotations.create(data);
      const uniqueId = getUniqueId("RKTVSQU", quotation["id"]);
      quotation.update({ quotation_number: uniqueId });
      message = "Saved Successfully";
    }
    return apiSuccess(res, "success", message, true);
  } catch (error) {
    return apiError(res, error.message);
  }
};
