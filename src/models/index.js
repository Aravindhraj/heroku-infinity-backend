const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const association = require("./create-association");
dotenv.config();

const sequelize = new Sequelize(
  process.env.NODE_DB_DATABASE,
  process.env.NODE_DB_USER,
  process.env.NODE_DB_PASSWORD,
  {
    host: process.env.NODE_DB_HOST,
    port: process.env.NODE_DB_PORT,
    dialect: process.env.NODE_DB_DIALECT,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.Permissions = require("./permissions.model.js")(sequelize, Sequelize);
db.Roles = require("./roles.model.js")(sequelize, Sequelize);
db.Insurance = require("./insurance.model.js")(sequelize, Sequelize);
db.Finance = require("./finance.model.js")(sequelize, Sequelize);
db.Department = require("./department.model.js")(sequelize, Sequelize);
db.RolePermissions = require("./role_permissions.model.js")(
  sequelize,
  Sequelize
);
db.UserRoles = require("./user_roles.model.js")(sequelize, Sequelize);
db.Categories = require("./categories.model.js")(sequelize, Sequelize);
db.Subcategories = require("./subcategories.model.js")(sequelize, Sequelize);
db.Colors = require("./colors.model.js")(sequelize, Sequelize);
db.PaymentTypes = require("./payment_types.model.js")(sequelize, Sequelize);
db.EnquiryTypes = require("./enquiry-types.model.js")(sequelize, Sequelize);
db.LeadTypes = require("./lead-types.model.js")(sequelize, Sequelize);
db.LeadCategories = require("./lead-categories.model.js")(sequelize, Sequelize);
db.Accessories = require("./accessories.model.js")(sequelize, Sequelize);
db.Varients = require("./varients.model.js")(sequelize, Sequelize);
db.Products = require("./products.model.js")(sequelize, Sequelize);
db.Enquiry = require("./enquiry.model.js")(sequelize, Sequelize);
db.SalesLead = require("./sales-lead.model.js")(sequelize, Sequelize);
db.Accessories = require("./accessories.model.js")(sequelize, Sequelize);
db.Receipts = require("./receipts.model.js")(sequelize, Sequelize);
db.SalesLeadAccessories = sequelize.define(
  "sales_lead_accessories",
  {
    price: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
db.ServiceHistory = require("./service-history.model")(sequelize, Sequelize);
db.ServiceSchedule = require("./service-schedule.model")(sequelize, Sequelize);
db.SpareParts = require("./spare-parts.model")(sequelize, Sequelize);
db.Purchases = require("./purchases.model")(sequelize, Sequelize);
db.Quotations = require("./quotations.model")(sequelize, Sequelize);

association.createAssociation(db);
module.exports = db;
