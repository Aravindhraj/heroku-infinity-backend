const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");
const { upload } = require("../helpers/upload.helper");
const { Op } = require("sequelize");
const { sendEmail } = require("../helpers/mailer");
const { sendSMS } = require("../helpers/sms");

exports.validate = (method) => {
  switch (method) {
    case "SaveLead":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "SalesLead"))
          .withMessage("Lead Doesn't Exists"),
        body("lead_type").notEmpty().withMessage("Lead Type is required"),
        body("lead_category")
          .notEmpty()
          .withMessage("Lead Category is required"),
        body("firstname").notEmpty().withMessage("Firstname is required"),
        body("lastname").notEmpty().withMessage("Lastname is required"),
        body("age").notEmpty().withMessage("Age is required"),
        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .bail()
          .isEmail()
          .withMessage("Invalid Email"),
        body("contact").notEmpty().withMessage("Contact is required"),
        body("address").notEmpty().withMessage("Address is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("pincode").notEmpty().withMessage("Pincode is required"),
        body("product_category")
          .notEmpty()
          .withMessage("Product Category is required")
          .custom((value) => idExists(value, "Categories"))
          .withMessage("Invalid Product Category"),
        body("product_subcategory")
          .notEmpty()
          .withMessage("Product Subategory is required")
          .custom((value) => idExists(value, "Subcategories"))
          .withMessage("Invalid Product Subcategory"),
        body("product")
          .notEmpty()
          .withMessage("Product is required")
          .custom((value) => idExists(value, "Products"))
          .withMessage("Invalid Product"),
        body("payment_type").notEmpty().withMessage("Payment Type is required"),
        body("advance_payment")
          .notEmpty()
          .withMessage(
            "Advance Payment can't be empty. Either enter 0 or more"
          ),
        body("buying_date").notEmpty().withMessage("Buying Date is required"),
        body("priority").notEmpty().withMessage("Priority is required"),
        body("sales_executive")
          .notEmpty()
          .withMessage("Sales Executive is required")
          .bail()
          .custom((value) => idExists(JSON.parse(value)["id"], "User"))
          .withMessage("Invalid Sales Executive"),
      ];
    case "getLead":
      return [
        body("id")
          .notEmpty()
          .withMessage("Id is required")
          .bail()
          .custom((value) => idExists(value, "SalesLead"))
          .withMessage("Sales Lead Can't be empty"),
      ];
    case "deleteLead":
      return [
        body("id")
          .notEmpty()
          .withMessage("Id is required")
          .bail()
          .custom((value) => idExists(value, "SalesLead"))
          .withMessage("Sales Lead Can't be empty"),
      ];
  }
};

exports.SaveLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiSuccess(res, { success: false, errors: errors["errors"] });
    }
    const data = req.body;
    let lead = null;
    let accessories_data = null;
    if (data['accessories']) {
      accessories_data = JSON.parse(data['accessories']);
    }
    delete data['accessories'];
    if (req.files && req.files.document) {
      const image = await upload(req.files.document, "sales-lead");
      if (!image) {
        return apiError(res, "Server Error");
      }
      data["document"] = image;
    } else {
      data["document"] = req.body.document_path;
    }
    if (data["sales_executive"]) {
      data["sales_executive"] = JSON.parse(data["sales_executive"]);
      data["sales_executive"] = data["sales_executive"]["id"];
    }
    if (data["priority"]) {
      data["priority"] = JSON.parse(data["priority"]);
      data["priority"] = data["priority"]["name"];
    }
    if (data["buying_date"]) {
      data["buying_date"] = JSON.parse(data["buying_date"]);
      data["buying_date"] = data["buying_date"]["name"];
    }
    if (data["lead_category"]) {
      data["lead_category"] = JSON.parse(data["lead_category"]);
      data["lead_category_id"] = data["lead_category"]["id"];
      data["lead_category"] = data["lead_category"]["name"];
    }
    if (data["lead_type"]) {
      data["lead_type"] = JSON.parse(data["lead_type"]);
      data["lead_type_id"] = data["lead_type"]["id"];
      data["lead_type"] = data["lead_type"]["name"];
    }
    if (data["finance_type"]) {
      data["finance_type"] = JSON.parse(data["finance_type"]);
      data["finance_type_id"] = data["finance_type"]["id"];
      data["finance_type"] = data["finance_type"]["name"];
    }
    if (data["payment_type"]) {
      data["payment_type"] = JSON.parse(data["payment_type"]);
      data["payment_type_id"] = data["payment_type"]["id"];
      data["payment_type"] = data["payment_type"]["name"];
    }

    if (data["id"] && data["id"] !== "" && data["id"] !== null) {
      delete data["enquiry_id"];
      lead = await db.SalesLead.findByPk(data["id"]);
      lead.update(data);
    } else {
      delete data["id"];
      if (!data["enquiry_id"]) {
        delete data["enquiry_id"];
      }
      lead = await db.SalesLead.create(data);
      if (accessories_data && accessories_data.length > 0) {
        for (let i = 0; i < accessories_data.length; i++) {
          await lead.addAccessory(accessories_data[i]["id"], { through: { price: accessories_data[i]['price'] } });
        }
      }
      if (
        data["enquiry_id"] &&
        data["enquiry_id"] !== "" &&
        data["enquiry_id"] !== null
      ) {
        enquiry = await db.Enquiry.findByPk(data["enquiry_id"]);
        enquiry.update({ converted_to_sales: 1 });
      }
      sendLeadSmsAndEmailToCust(data);
    }
    
    return apiSuccess(
      res,
      { success: true },
      data["id"]
        ? "Sales Lead Updated Successfully"
        : "Sales Lead Added Successfully",
      true
    );
  } catch (error) {
    console.log(error);
    return apiError(res);
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const { start, perPage, sortMode, search } = req.body;
    let { sortBy } = req.body;
    if (sortBy === "product_data.name") {
      sortBy = [
        [
          { model: db.Products, as: "product_data" },
          "name",
          sortMode.toUpperCase(),
        ],
      ];
    } else if (sortBy === "full_name") {
      sortBy = [
        [
          db.sequelize.literal("CONCAT(firstname,' ',lastname)"),
          sortMode.toUpperCase(),
        ],
      ];
    } else {
      sortBy = [[sortBy, sortMode.toUpperCase()]];
    }
    const allLeads = await db.SalesLead.findAll({
      attributes: [
        "id",
        "lead_type",
        "lead_category",
        [db.sequelize.literal("CONCAT(firstname,' ',lastname)"), "full_name"],
      ],
      order: sortBy,
      limit: perPage,
      offset: (start - 1) * perPage,
      where: {
        [Op.or]: [
          {
            lead_type: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            lead_category: {
              [Op.like]: `%${search}%`,
            },
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
        ],
      },
      include: {
        model: db.Products,
        as: "product_data",
        attributes: ["id", "name"],
        include: {
          model: db.Varients,
          as: "varients",
          attributes: ["id", "name"],
        },
      },
    });
    return apiSuccess(res, allLeads);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return apiError(res, errors[0]["msg"], true);
    }
    const lead = await db.SalesLead.findOne({
      where: {
        id: req.body.id,
      },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "age",
        "email",
        "contact",
        "alternate_contact",
        "address",
        "location",
        "city",
        "pincode",
        "product_category",
        "product_subcategory",
        "product",
        "product_user",
        "advance_payment",
        "delivery_date",
        "buying_date",
        "priority",
        "document",
      ],
      include: [
        {
          model: db.LeadTypes,
          as: "lead_type_data",
          attributes: ["id", "name"],
        },
        {
          model: db.LeadCategories,
          as: "lead_category_data",
          attributes: ["id", "name"],
        },
        {
          model: db.PaymentTypes,
          as: "payment_type_data",
          attributes: ["id", "name"],
        },
        {
          model: db.Finance,
          as: "finance_type_data",
          attributes: ["id", "name"],
        },
        {
          model: db.User,
          as: "sales_user",
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: db.Accessories,
          as: "accessories",
          attributes: ["id", "name", "price"],
        },
      ],
    });
    return apiSuccess(res, lead);
  } catch (error) {
    return apiError(res, error.message);
  }
};

sendLeadSmsAndEmailToCust = async (data) => {
  //send sms & email to customer start
  const product = await db.Products.findOne({
    where: {
      id: data.product,
    }
  });

  var message_content = "Dear " + data.firstname + " " + data.lastname + ", Thanks for booking " + product.name + ".";
  if (data.advance_payment != "" && data.advance_payment != "0")
    message_content += "Your advance payment Rs." + data.advance_payment + " is received. ";

  if (data.delivery_date != "")
    message_content += " Your product will be delivered on or before " + data.delivery_date;
  else
    message_content += " Your product will be delivered soon";

  sendSMS({ phone_number: data.contact, message: message_content });
  sendEmail({ subject: "RKTVS Purchase Confirmation", text: message_content, to: data.email });
  //send sms & email to customer end
}