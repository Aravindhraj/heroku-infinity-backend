exports.createAssociation = (db) => {
  // Role Permission Association
  db.Roles.hasMany(db.RolePermissions, {
    foreignKey: "role_id",
    as: "permissions",
  });

  db.RolePermissions.belongsTo(db.Permissions, {
    foreignKey: "permission_id",
    as: "permission_detail",
  });

  // User Role Association
  db.User.belongsToMany(db.Roles, {
    through: db.UserRoles,
    as: "roles",
    foreignKey: "user_id",
  });

  db.User.belongsTo(db.Department, {
    foreignKey: "department_id",
    as: "department",
  });

  db.Department.hasMany(db.User, {
    foreignKey: "department_id",
    as: "users",
  });

  db.Roles.belongsToMany(db.User, {
    through: db.UserRoles,
    as: "users",
    foreignKey: "role_id",
  });

  db.Subcategories.belongsTo(db.Categories, {
    foreignKey: "category_id",
    as: "category",
  });

  db.Categories.hasMany(db.Subcategories, {
    foreignKey: "category_id",
    as: "subcategories",
  });

  // product relation
  db.Products.belongsTo(db.Categories, {
    foreignKey: "category_id",
    as: "category",
  });
  db.Products.belongsTo(db.Subcategories, {
    foreignKey: "subcategory_id",
    as: "sub_category",
  });
  db.Products.belongsTo(db.Varients, {
    foreignKey: "varient_id",
    as: "varients",
  });

  db.Categories.hasMany(db.Products, {
    foreignKey: "category_id",
    as: "products",
  });



  // Enquriry
  db.Enquiry.belongsTo(db.Products, {
    foreignKey: "product_id",
    as: "product",
  });

  db.Enquiry.belongsTo(db.User, {
    foreignKey: "sales_user",
    as: "sales"
  });

  // Sales Lead
  db.SalesLead.belongsTo(db.Enquiry, {
    foreignKey: "enquiry_id",
    as: "enquiry"
  });
  db.SalesLead.belongsTo(db.Categories, {
    foreignKey: "product_category",
    as: "category"
  });
  db.SalesLead.belongsTo(db.Subcategories, {
    foreignKey: "product_subcategory",
    as: "subcategory"
  });
  db.SalesLead.belongsTo(db.Products, {
    foreignKey: "product",
    as: "product_data"
  });
  db.SalesLead.belongsTo(db.User, {
    foreignKey: "sales_executive",
    as: "sales_user"
  });
  db.SalesLead.belongsTo(db.Finance, {
    foreignKey: "finance_type_id",
    as: "finance_type_data"
  });
  db.SalesLead.belongsTo(db.PaymentTypes, {
    foreignKey: "payment_type_id",
    as: "payment_type_data"
  });
  db.SalesLead.belongsTo(db.LeadTypes, {
    foreignKey: "lead_type_id",
    as: "lead_type_data"
  });
  db.SalesLead.belongsTo(db.LeadCategories, {
    foreignKey: "lead_category_id",
    as: "lead_category_data"
  });

  db.SalesLead.belongsToMany(db.Accessories, {
    through: db.SalesLeadAccessories,
    as: 'accessories',
    foreignKey: 'sales_lead_id',
    otherKey: 'accessories_id'
  });


  db.ServiceHistory.belongsTo(db.Products, {
    foreignKey: "product",
    as: "product_data"
  });
  db.ServiceHistory.belongsTo(db.User, {
    foreignKey: "serviced_by_id", 
    as: "serviced_by_data"
  });
  db.ServiceHistory.belongsTo(db.User, {
    foreignKey: "customer_id", 
    as: "customer_data"
  }); 
  db.ServiceHistory.belongsTo(db.SpareParts, {
    foreignKey: "changed_part_id", 
    as: "spare_part_data"
  });

  db.ServiceSchedule.belongsTo(db.Products, {
    foreignKey: "product",
    as: "product_data"
  });
  db.ServiceSchedule.belongsTo(db.User, {
    foreignKey: "customer_id", 
    as: "customer_data"
  }); 

  db.Purchases.belongsTo(db.Products, {
    foreignKey: "product_id",
    as: "product_data"
  });
  
  db.Purchases.belongsTo(db.User, {
    foreignKey: "customer_id", 
    as: "customer_data"
  }); 
  db.Purchases.belongsTo(db.User, {
    foreignKey: "sales_person_id", 
    as: "sales_person_data"
  });

  db.Quotations.belongsTo(db.Products, {
    foreignKey: "product_id",
    as: "product_data"
  });
  db.Quotations.belongsTo(db.User, {
    foreignKey: "sales_person_id", 
    as: "sales_person_data"
  });

};
