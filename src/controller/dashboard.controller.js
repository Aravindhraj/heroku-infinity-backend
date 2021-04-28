const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { Op } = require("sequelize");

exports.getCounters = async (req, res) => {
  try {
    const { _id, permissions, role } = req.user;
    const counters = {};
    if (role["id"] === 1) {
      counters["enquiry"] = await db.Enquiry.count();
      counters["sales_lead"] = await db.SalesLead.count();
      counters["service_history"] = await db.ServiceHistory.count();
      counters["service_schedule"] = await db.ServiceSchedule.count();
      counters["purchases"] = await db.Purchases.count();
      counters["quotations"] = await db.Quotations.count();
      counters["receipts"] = await db.Receipts.count();
    } else {
      const allowed = permissions
        .map((item) => (item.read ? item.permission_detail.name : ""))
        .filter((item) => item !== "");

      for (const permission of allowed) {
        if (permission === "enquiry") {
          counters[permission] = await db.Enquiry.count({
            // where: {
            //   created_by: _id,
            // },
          });
        }
        if (permission === "sales_lead") {
          counters[permission] = await db.SalesLead.count({
            where: {
              sales_executive: {
                [Op.eq]: _id,
              },
            },
          });
          counters["purchases"] = await db.Purchases.count({
            where: {
              sales_person_id: {
                [Op.eq]: _id,
              },
            },
          });
          counters["quotations"] = await db.Quotations.count();
        }

        if (permission === "service" && role["id"]!= 6) {
          counters["service_history"] = await db.ServiceHistory.count();
          counters["service_schedule"] = await db.ServiceSchedule.count();
        }
      }
    }
    return apiSuccess(res, counters, "");
  } catch (error) {
    return apiError(res, error.message);
  }
};

// exports.getCustomerDashDetails = async (req, res) => {
// req.User
// };