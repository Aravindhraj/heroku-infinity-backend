const { validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { Op } = require("sequelize");
const { sendEmail } = require("../helpers/mailer");
const { sendSMS } = require("../helpers/sms");

exports.SavePurchase = async (req, res) => {
    try {

        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return apiSuccess(res, { success: false, errors: errors["errors"] });
        // }
        const data = req.body;
        let purchase = null;

        if (data["customer"]) {
            data["customer"] = JSON.parse(data["customer"]);
            data["customer_id"] = data["customer"]["id"];
        }
        if (data["sales_person"]) {
            data["sales_person"] = JSON.parse(data["sales_person"]);
            data["sales_person_id"] = data["sales_person"]["id"];
        }

        if (data["product"]) {
            data["product"] = JSON.parse(data["product"]);
            data["product_id"] = data["product"]["id"];
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
            purchase = await db.Purchases.findByPk(data["id"]);
            purchase.update(data);
        } else {
            delete data["id"];

            purchase = await db.Purchases.create(data);

            sendPurchaseSmsAndEmailToCust(data);

        }
        return apiSuccess(
            res,
            { success: true },
            data["id"]
                ? "Purchase Updated Successfully"
                : "Purchase Added Successfully",
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

        let allPurchases;
        if (cust_id) {
            allPurchases = await db.Purchases.findAll({
                attributes: [
                    "id",
                    "purchase_number",
                    "purchase_date"
                ],
                order: sortBy,
                limit: perPage,
                offset: (start - 1) * perPage,
                where: {
                    customer_id: cust_id,
                    [Op.or]: [
                        {
                            purchase_number: {
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
                        {
                            "$sales_person_data.firstname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$sales_person_data.lastname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$customer_data.firstname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$customer_data.lastname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    ],
                },
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
                },
                {
                    model: db.User,
                    as: "sales_person_data",
                    attributes: ["id", "firstname", "lastname"]
                }
                ],

            });
        } else {
            allPurchases = await db.Purchases.findAll({
                attributes: [
                    "id",
                    "purchase_number",
                    "purchase_date"
                ],
                order: sortBy,
                limit: perPage,
                offset: (start - 1) * perPage,
                where: {
                    [Op.or]: [
                        {
                            purchase_number: {
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
                        {
                            "$sales_person_data.firstname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$sales_person_data.lastname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$customer_data.firstname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$customer_data.lastname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    ],
                },
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
                },
                {
                    model: db.User,
                    as: "sales_person_data",
                    attributes: ["id", "firstname", "lastname"]
                }
                ],

            });
        }
        // allServiceHistory[customer] = await db.User.findOne({
        //     where: { id: allServiceHistory[customer_id] },
        //   });


        return apiSuccess(res, allPurchases);
    } catch (error) {
        return apiError(res, error.message);
    }
};

exports.getPurchase = async (req, res) => {
    try {
        const purchase = await db.Purchases.findOne({
            where: {
                id: req.body.id,
            },
            attributes: [
                "id",
                "purchase_number",
                "purchase_date"
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
            },
            {
                model: db.User,
                as: "sales_person_data",
                attributes: ["id", "firstname", "lastname"]
            }
            ]
        });
        return apiSuccess(res, purchase);
    } catch (error) {
        return apiError(res, error.message);
    }
};

exports.fetchRecentPurchase = async (req, res) => {
    
    try {
        let { cust_id } = req.body;
       
        let recentPurchase;
        recentPurchase = await db.Purchases.findAll({
            limit: 1,
            attributes: [
                "id",
                "purchase_number",
                "purchase_date"
            ],
            where: {
                customer_id: cust_id,
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.Products,
                as: "product_data",
                attributes: ["id", "name", "vehicle_cost", "road_tax_cost","insurance_cost","reg_handling_cost","min_accessories_cost","extra_fitting_cost","total_sales_price"],
                include: {
                    model: db.Varients,
                    as: "varients",
                    attributes: ["id", "name"],
                },
            }
            ],

        });

        // allServiceHistory[customer] = await db.User.findOne({
        //     where: { id: allServiceHistory[customer_id] },
        //   });


        return apiSuccess(res, recentPurchase);
    } catch (error) {
        return apiError(res, error.message);
    }
};


sendPurchaseSmsAndEmailToCust = async (data) => {
    //send sms & email to customer start
    const product = await db.Products.findOne({
      where: {
        id: data.product.id,
      }
    });
  
    const customer = await db.User.findOne({
      where: {
        id: data.customer.id,
      },
      attributes: ["firstname", "lastname", "mobile", "email"]
    });
  
    var message_content = "Congratulations " + customer.firstname+" "+customer.lastname + ", on buying your new " + product.name + ". Happy Riding!";
    sendSMS({ phone_number: customer.mobile, message: message_content });
    sendEmail({ subject: "RKTVS - Purchase", text: message_content, to: customer.email });
    //send sms & email to customer end
  }