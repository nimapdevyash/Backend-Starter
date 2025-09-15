const { expression } = require("joi");

exports.httpMethod_enums = {
  get: "GET",
  put: "PUT",
  post: "POST",
  delete: "DELETE",
  patch: "PATCH",
};

exports.sortingOrder_enums = {
  ASC: "ASC",
  DESC: "DESC",
};

exports.approval_status_enums = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
};

exports.property_status_enums = {
  available: "AVAILABLE",
  sold: "SOLD",
  rented: "RENTED"
};

exports.payment_mode_enums = {
  card: "CARD",
  cash: "CASH",
  upi: "UPI",
};

exports.payment_status_enums = {
  initiated: "INITIATED",
  paid: "PAID",
  failed: "FAILED",
  pending: "PENDING",
};

exports.furnished_type_enums = {
  fullyFurnished: "FULLY_FURNISHED",
  semiFurnished: "SEMI_FURNISHED",
  notFurnished: "NOT_FURNISHED",
};

exports.property_listing_type_enums = {
  sell: "SELL",
  rent: "RENT",
};

exports.role_enums = {
  admin : "ADMIN",
  customer : "USER"
}

exports.property_purchase_request_status_enums = {
  interested: "INTERESTED",
  approved: "APPROVED",
  rejected: "REJECTED",
  sold: "SOLD",
  rented: "RENTED",
};

exports.account_status_enums = {
  active: "ACTIVE",
  inactive: "INACTIVE",
  suspended: "SUSPENDED",
};

exports.subscription_status_enums = {
  active: "ACTIVE",
  expired: "EXPIRED",
  cancelled: "CANCELLED",
};

exports.service_interest_status = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
  completed: "COMPLETED"
};

exports.subscription_plan_type = {
  seller: "SELLER",
  serviceProvider: "SERVICE_PROVIDER"
};
exports.agreement_status = {
  initiated: "INITIATED",
  signInProcess: "SIGN-IN-PROCESS",
  readyForApproval: "READY-FOR-APPROVAL",
  approved: "APPROVED",
  rejected: "REJECTED",
};

exports.subscription_plan_history_action_types_enums = {
  create : "CREATE",
  update: "UPDATE",
  delete: "DELETE"
}

exports.validation_types_enums = {
  body: "body",
  all: "all",
  params: "params",
  query: "query",
  params_body: "params_body"
}