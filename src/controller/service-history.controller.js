const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");
const { upload } = require("../helpers/upload.helper");
const { Op } = require("sequelize");

exports.validate = (method) => {
    switch (method) {
        case "SaveServiceHistory":
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
        case "getServiceHistory":
            return [
                body("id")
                    .notEmpty()
                    .withMessage("Id is required")
                    .bail()
                    .custom((value) => idExists(value, "ServiceHistory"))
                    .withMessage("Service History Can't be empty"),
            ];
        case "deleteServiceHistory":
            return [
                body("id")
                    .notEmpty()
                    .withMessage("Id is required")
                    .bail()
                    .custom((value) => idExists(value, "ServiceHistory"))
                    .withMessage("Service History Can't be empty"),
            ];
    }
};

exports.SaveServiceHistory = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiSuccess(res, { success: false, errors: errors["errors"] });
        }
        const data = req.body;

        let serviceHistory = null;

        if (data["customer"]) {
            data["customer"] = JSON.parse(data["customer"]);
            data["customer_id"] = data["customer"]["id"];
        }
        if (data["serviced_by"]) {
            data["serviced_by"] = JSON.parse(data["serviced_by"]);
            data["serviced_by_id"] = data["serviced_by"]["id"];
        }
        // if (data["service_date"]) {
        //     data["service_date"] = JSON.parse(data["service_date"]);
        //     data["service_date"] = data["service_date"]["name"];
        // }   
        if (data["product"]) {
            data["product"] = JSON.parse(data["product"]);
            data["product"] = data["product"]["id"];
        }

        if (data["changed_spare_parts"] && data["changed_spare_parts"] !== undefined) {
            data["changed_spare_parts"] = JSON.parse(data["changed_spare_parts"]);
            data["changed_part_id"] = data["changed_spare_parts"]["id"];
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
            serviceHistory = await db.ServiceHistory.findByPk(data["id"]);
            serviceHistory.update(data);
        } else {
            delete data["id"];

            serviceHistory = await db.ServiceHistory.create(data);

        }
        return apiSuccess(
            res,
            { success: true },
            data["id"]
                ? "Service History Updated Successfully"
                : "Service History Added Successfully",
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

        let allServiceHistory;
        if (cust_id) {
            allServiceHistory = await db.ServiceHistory.findAll({
                attributes: [
                    "id",
                    "service_round",
                    "problem",
                    "service_date",
                    "serviced_by_id",
                    "customer_id"
                ],
                order: sortBy,
                limit: perPage,
                offset: (start - 1) * perPage,
                where: {
                    customer_id: cust_id,
                    [Op.or]: [
                        {
                            problem: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            service_round: {
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
                            "$serviced_by_data.firstname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$serviced_by_data.lastname$": {
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
                    as: "serviced_by_data",
                    attributes: ["id", "firstname", "lastname"]
                },
                {
                    model: db.SpareParts,
                    as: "spare_part_data",
                    attributes: ["id", "name", "status"]
                }
                ],

            });
        } else {
            allServiceHistory = await db.ServiceHistory.findAll({
                attributes: [
                    "id",
                    "service_round",
                    "problem",
                    "service_date",
                    "serviced_by_id",
                    "customer_id"
                ],
                order: sortBy,
                limit: perPage,
                offset: (start - 1) * perPage,
                where: {
                    [Op.or]: [
                        {
                            problem: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            service_round: {
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
                            "$serviced_by_data.firstname$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$serviced_by_data.lastname$": {
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
                    as: "serviced_by_data",
                    attributes: ["id", "firstname", "lastname"]
                },
                {
                    model: db.SpareParts,
                    as: "spare_part_data",
                    attributes: ["id", "name", "status"]
                }
                ],

            });
        }
        // allServiceHistory[customer] = await db.User.findOne({
        //     where: { id: allServiceHistory[customer_id] },
        //   });


        return apiSuccess(res, allServiceHistory);
    } catch (error) {
        return apiError(res, error.message);
    }
};

exports.getServiceHistory = async (req, res) => {
    try {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return apiError(res, errors[0]["msg"], true);
        }
        const serviceHistory = await db.ServiceHistory.findOne({
            where: {
                id: req.body.id,
            },
            attributes: [
                "id",
                "service_round",
                "problem",
                "service_date",
                "serviced_by_id",
                "customer_id"
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
                as: "serviced_by_data",
                attributes: ["id", "firstname", "lastname"]
            },
            {
                model: db.SpareParts,
                as: "spare_part_data",
                attributes: ["id", "name", "status"]
            }
            ]
        });
        return apiSuccess(res, serviceHistory);
    } catch (error) {
        return apiError(res, error.message);
    }
};