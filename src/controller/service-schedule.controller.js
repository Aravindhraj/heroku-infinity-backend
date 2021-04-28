const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");
const { sendEmail } = require("../helpers/mailer");
const { sendSMS } = require("../helpers/sms");

exports.validate = (method) => {
    switch (method) {
        case "SaveServiceSchedule":
            return [
                body("id")
                    .if((value) => value !== "")
                    .custom((value) => idExists(value, "SalesLead"))
                    .withMessage("Lead Doesn't Exists"),
                body("service_round").notEmpty().withMessage("Service Round is required"),
                body("product")
                    .notEmpty()
                    .withMessage("Product is required")
                    .custom((value) => idExists(value, "Products"))
                    .withMessage("Invalid Product"),
                body("customer")
                    .notEmpty()
                    .withMessage("Customer is required")
                    .bail()
                    .custom((value) => idExists(JSON.parse(value)["id"], "User"))
                    .withMessage("Invalid Customer"),
                body("problem").notEmpty().withMessage("Problem is required"),
                body("service_date")
                    .notEmpty()
                    .withMessage(
                        "Service date is required"
                    ),
                body("service_person")
                    .notEmpty()
                    .withMessage("Service Person is required")
                    .bail()
                    .custom((value) => idExists(JSON.parse(value)["id"], "User"))
                    .withMessage("Invalid Service Person"),

            ];
        case "getServiceSchedule":
            return [
                body("id")
                    .notEmpty()
                    .withMessage("Id is required")
                    .bail()
                    .custom((value) => idExists(value, "ServiceSchedule"))
                    .withMessage("Service Schedule Can't be empty"),
            ];
        case "deleteServiceSchedule":
            return [
                body("id")
                    .notEmpty()
                    .withMessage("Id is required")
                    .bail()
                    .custom((value) => idExists(value, "ServiceSchedule"))
                    .withMessage("Service Schedule Can't be empty"),
            ];
    }
};

exports.SaveServiceSchedule = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiSuccess(res, { success: false, errors: errors["errors"] });
        }
        const data = req.body;
        let serviceSchedule = null;

        if (data["customer"]) {
            data["customer"] = JSON.parse(data["customer"]);
            data["customer_id"] = data["customer"]["id"];
        }
        // if (data["serviced_by"]) {
        //     data["serviced_by"] = JSON.parse(data["serviced_by"]);
        //     data["serviced_by_id"] = data["serviced_by"]["id"];
        // }
        // if (data["service_date"]) {
        //     data["service_date"] = JSON.parse(data["service_date"]);
        //     data["service_date"] = data["service_date"]["name"];
        // }   
        if (data["product"]) {
            data["product"] = JSON.parse(data["product"]);
            data["product"] = data["product"]["id"];
        }
        // if (data["problem"]) {
        //     data["problem"] = JSON.parse(data["problem"]);
        //     data["problem"] = data["problem"]["name"];
        // }
        // if (data["service_round"]) {
        //     data["service_round"] = JSON.parse(data["service_round"]);
        //     data["service_round"] = data["service_round"]["name"];
        // }




        if (data["id"] && data["id"] !== "" && data["id"] !== null) {
            serviceSchedule = await db.ServiceSchedule.findByPk(data["id"]);
            serviceSchedule.update(data);
        } else {
            delete data["id"];

            serviceSchedule = await db.ServiceSchedule.create(data);
            sendServSchSmsAndEmailToCust(data);
    
        }
        return apiSuccess(
            res,
            { success: true },
            data["id"]
                ? "Service Schedule Updated Successfully"
                : "Service Schedule Added Successfully",
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
        let { sortBy, cust_id } = req.body;

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

        let allServiceSchedule;
        if (cust_id) {

            allServiceSchedule = await db.ServiceSchedule.findAll({
                attributes: [
                    "id",
                    "customer_id",
                    "purchase_date",
                    "service_type",
                    "service_round",
                    "service_date",
                    "service_time",
                    "notify_customer"
                    
                ],
                order: sortBy,
                limit: perPage,
                offset: (start - 1) * perPage,
                where: { customer_id: cust_id},
                include: [{
                    model: db.Products,
                    as: "product_data",
                    attributes: ["id", "name"],
                    include: {
                        model: db.Varients,
                        as: "varients",
                        attributes: ["id", "name"],
                    },
                },
                {
                    model: db.User,
                    as: "customer_data",
                    attributes: ["id", "firstname", "lastname"]
                }
                ],

            });
        } else {
             allServiceSchedule = await db.ServiceSchedule.findAll({
                attributes: [
                    "id",
                    "customer_id",
                    "purchase_date",
                    "service_type",
                    "service_round",
                    "service_date",
                    "service_time",
                    "notify_customer"
                    
                ],
                order: sortBy,
                limit: perPage,
                offset: (start - 1) * perPage,
                include: [{
                    model: db.Products,
                    as: "product_data",
                    attributes: ["id", "name"],
                    include: {
                        model: db.Varients,
                        as: "varients",
                        attributes: ["id", "name"],
                    },
                },
                {
                    model: db.User,
                    as: "customer_data",
                    attributes: ["id", "firstname", "lastname"]
                }
                ],

            });
        }
        // allServiceSchedule[customer] = await db.User.findOne({
        //     where: { id: allServiceSchedule[customer_id] },
        //   });


        return apiSuccess(res, allServiceSchedule);
    } catch (error) {
        return apiError(res, error.message);
    }
};

exports.getServiceSchedule = async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return apiError(res, errors[0]["msg"], true);
      }
      const serviceSchedule = await db.ServiceSchedule.findOne({
        where: {
          id: req.body.id,
        },
        attributes: [
            "id",
            "customer_id",
            "purchase_date",
            "service_type",
            "service_round",
            "service_date",
            "service_time",
            "notify_customer"
            
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
        },
        {
            model: db.User,
            as: "customer_data",
            attributes: ["id", "firstname", "lastname"]
        }
        ]
      });

      
      return apiSuccess(res, serviceSchedule);
    } catch (error) {
      return apiError(res, error.message);
    }
  };

  sendServSchSmsAndEmailToCust = async (data) => {
  //send sms & email to customer start
  const product = await db.Products.findOne({
    where: {
      id: data.product,
    }
  });

  const customer = await db.User.findOne({
    where: {
      id: data.customer.id,
    },
    attributes: ["firstname", "lastname", "mobile", "email"]
  });

  var message_content = "Dear " + customer.firstname+" "+customer.lastname + ", Your service for your " + product.name + " is scheduled on "+data.service_date+" "+data.service_time+".";
  sendSMS({ phone_number: customer.mobile, message: message_content });
  sendEmail({ subject: "RKTVS - Service Scheduled", text: message_content, to: customer.email });
  //send sms & email to customer end
}