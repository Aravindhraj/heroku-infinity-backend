const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");
const { Op } = require("sequelize");
const { sendEmail } = require("../helpers/mailer");
const { sendSMS } = require("../helpers/sms");

exports.validate = (method) => {
  switch (method) {
    case "fetchEnquiry":
      return [
        body("id")
          .notEmpty()
          .withMessage("Invalid Data")
          .bail()
          .custom((value) => idExists(value, "Enquiry"))
          .withMessage("Enquiry Doesn't Exists"),
      ];
    case "saveEnquiry":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Enquiry"))
          .withMessage("Enquiry Doesn't Exists"),
        body("firstname").notEmpty().withMessage("Invalid Data"),
        body("email")
          .if((value) => value !== "" && value !== null)
          .isEmail()
          .withMessage("Enter Valid Email"),
        body("product_id")
          .notEmpty()
          .withMessage("Invalid Data")
          .bail()
          .custom((value) => idExists(value, "Products"))
          .withMessage("Product Doesn't Exists"),
        body("type").notEmpty().withMessage("Invalid Data"),
        body("priority").notEmpty().withMessage("Invalid Data"),
        body("sales_user")
          .notEmpty()
          .withMessage("Invalid Data")
          .bail()
          .custom((value) => idExists(value, "User"))
          .withMessage("Sales Person Doesn't Exists"),
      ];
  }
};

exports.saveEnquiry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiSuccess(res, { success: false, errors: errors["errors"] });
  }
  const data = req.body;
  let enquiry = null;
  if (data["id"] && data["id"] !== "" && data["id"] !== null) {
    enquiry = await db.Enquiry.findByPk(data["id"]);
    enquiry.update(data);
  } else {
    enquiry = await db.Enquiry.create(data);
    sendEnquirySmsAndEmailToCust(data);
  }
  return apiSuccess(
    res,
    { success: true },
    data["id"] ? "Enquiry Updated Successfully" : "Enquiry Added Successfully",
    true
  );
};

exports.fetchAll = async (req, res) => {
  const { start, perPage, sortMode, search } = req.body;
  let { sortBy } = req.body;
  if (sortBy === "product.name") {
    sortBy = [
      [{ model: db.Products, as: "product" }, "name", sortMode.toUpperCase()],
    ];
  } else if (sortBy === "sales") {
    sortBy = [
      [{ model: db.User, as: "sales" }, "firstname", sortMode.toUpperCase()],
    ];
  } else {
    sortBy = [[sortBy, sortMode.toUpperCase()]];
  }
  const enquiries = await db.Enquiry.findAll({
    attributes: [
      "id",
      "firstname",
      "lastname",
      "email",
      "priority",
      "converted_to_sales",
    ],
    include: [
      {
        model: db.Products,
        as: "product",
        attributes: ["id", "name"],
      },
      {
        model: db.User,
        as: "sales",
        attributes: ["id", "firstname", "lastname"],
      },
    ],
    order: sortBy,
    limit: perPage,
    offset: (start - 1) * perPage,
    where: {
      [Op.or]: [
        {
          firstname: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          lastname: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          priority: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$product.name$": {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$sales.firstname$": {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$sales.lastname$": {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  });
  return apiSuccess(res, enquiries);
};

exports.fetchEnquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors[0]["msg"], true);
    }
    const enquiry = await db.Enquiry.findOne({
      where: {
        id: req.body.id,
      },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phone",
        "city",
        "pincode",
        "type",
        "product_id",
        "type",
        "expected_to_buy",
        "description",
        "priority",
      ],
    });
    return apiSuccess(res, enquiry);
  } catch (error) {
    return apiError(res);
  }
};

exports.fetchEnquiryWithDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors[0]["msg"], true);
    }
    const enquiry = await db.Enquiry.findOne({
      where: {
        id: req.body.id,
      },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phone",
        "city",
        "pincode",
        "type",
        "product_id",
        "type",
        "expected_to_buy",
        "description",
        "priority",
        "sales_user",
      ],
      include: [
        {
          model: db.Products,
          as: "product",
          attributes: ["id", "name", "varient_id"],
          include: [
            {
              model: db.Categories,
              as: "category",
              attributes: ["id", "name"],
            },
            {
              model: db.Subcategories,
              as: "sub_category",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: db.User,
          as: "sales",
          attributes: ["id", "firstname", "lastname"],
        },
      ],
    });
    return apiSuccess(res, enquiry);
  } catch (error) {
    console.log(error);
    return apiError(res);
  }
};


sendEnquirySmsAndEmailToCust = async(data) => {
  //send sms & email to customer start
  const product = await db.Products.findOne({
    where: {
      id: data.product_id,
    }
  });
  const user = await db.User.findOne({
    where: {
      id: data.sales_user,
    },
    attributes: ["firstname", "lastname"]
  });
  const message_content = "Dear Customer, Thanks for your enquiry on our product " + product.name + ".Our Sales executive " + user.firstname + " " + user.lastname + " will contact you soon. ";
  sendSMS({phone_number:data.phone, message:message_content});
  sendEmail({subject:"RKTVS Product Enquiry",text:message_content,to:data.email});  
  //send sms & email to customer end
}