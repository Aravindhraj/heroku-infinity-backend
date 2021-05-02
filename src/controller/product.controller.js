const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { upload } = require("../helpers/upload.helper");
const { idExists } = require("../helpers/validator.helper");

exports.validate = (method) => {
  switch (method) {
    case "singleProduct":
      return [
        body("id")
          .notEmpty()
          .withMessage("Product doest Not Exists")
          .bail()
          .custom((value) => idExists(value, "Products")),
      ];
    case "saveProduct":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Products"))
          .withMessage("Product doest Not Exists"),
        body("name").notEmpty().withMessage("Enter Name"),
        body("varient_id").notEmpty().withMessage("Select Varient Name"),
        body("category_id").notEmpty().withMessage("Enter Category"),
        body("subcategory_id").notEmpty().withMessage("Enter Subcategory"),
      ];
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { start, perPage, sortBy, sortMode, search } = req.body;
    const products = await db.Products.findAll({
      attributes: ["id", "category_id", "name", "image", "status"],
      order: [[sortBy, sortMode.toUpperCase()]],
      limit: perPage,
      offset: (start - 1) * perPage,
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });
    const total = await db.Products.count({
      order: [[sortBy, sortMode.toUpperCase()]],
      limit: perPage,
      offset: (start - 1) * perPage,
    });
    return apiSuccess(res, { records: products, total: total });
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true);
    }
    const product = await db.Products.findOne({
      where: {
        id: req.body.id,
      },
    });
    return apiSuccess(res, product);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.fetchActiveProducts = async (req, res) => {
  try {
    const products = await db.Products.findAll({
      where: {
        status: {
          [Op.in]: ['1','t'],
        },
      },
      attributes: [
        "id",
        "name",
        "image",
        "category_id",
        "subcategory_id",
        "vehicle_cost",
        "road_tax_cost",
        "insurance_cost",
        "reg_handling_cost",
        "min_accessories_cost",
        "extra_fitting_cost",
        "total_sales_price"
      ],
      include: {
        model: db.Varients,
        as: "varients",
        attributes: ["id", "name"],
      }
    });
    return apiSuccess(res, products);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Products.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveProduct = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true);
    }

    console.log(req.body);

    const { id } = req.body;

    if (req.files && req.files.image) {
      const image = await upload(req.files.image, "products");
      if (!image) {
        return apiError(res, "Server Error");
      }
      req.body.image = image;
    } else {
      req.body.image = req.body.image_path;
    }

    let message = "";
    if (id) {
      // update
      product = await db.Products.findByPk(id);
      product.update(req.body);
      message = "Updated Successfully";
    } else {
      // create
      await db.Products.create(req.body);
      message = "Saved Successfully";
    }
    return apiSuccess(res, "success", message, true);
  } catch (error) {
    return apiError(res, error.message);
  }
};
