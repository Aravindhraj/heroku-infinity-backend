const db = require("../models");
const { Op } = require("sequelize");

exports.idExists = (id, model) => {
  return db[model].findByPk(id).then((record) => {
    if (!record) {
      return Promise.reject("Record doesn't exists");
    }
  });
};

exports.isDuplicateEntry = async (value, field, id, model) => {
  const condition = {
    [field]: {
      [Op.eq]: value,
    },
  };
  if (id) {
    condition["id"] = {
      [Op.ne]: id,
    };
  }
  const count = await db[model].count({
    where: condition,
  });
  return count;
};
