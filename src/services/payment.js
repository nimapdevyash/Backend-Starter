const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/customError");
const commonFunctions = require("../../utils/commonFunctions");
const db = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const handleSuccess = require("../../utils/successHandler");
const moment = require("moment");
const {
  subscription_status_enums,
  payment_status_enums,
} = require("../../utils/enums");
const crypto = require("crypto");
const sendEmail = require("../../utils/emailService");
const {
  generatePaymentReceipt,
} = require("../../utils/generatePaymentReceipt");
const webhookKey = process.env.STRIPE_WEBHOOK_SECRET;

// invoke payment user interface and generate client secret id using initiate
exports.initiatePaymentIntent = async (orderId, buyerId) => {
  const order = await commonFunctions.findByPk(db.tempOrder, orderId);
  if (!order) {
    throw new BadRequestError(`temp order not found`);
  }
  if (order.status !== "initiated") {
    throw new BadRequestError(`temp order not valid`);
  }
  if (moment(order.createdAt).add(2, "minutes").toDate() < moment().toDate()) {
    throw new BadRequestError(`Temp Order not valid`);
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseFloat(order?.totalAmount || 1) * 100,
      currency: "dkk",
      payment_method_types: ["card"],
      metadata: {
        orderId: orderId,
        buyerId: buyerId,
      },
    });

    return handleSuccess("Payment Intent Created Sucessfully", paymentIntent);
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

//payment paid successfully change order status and store transcation id in db
exports.verifyPaymentAndUpdateStatus = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const event = await stripe.webhooks.constructEvent(
    req.body,
    signature,
    webhookKey
  );
  switch (event.type) {
    case "payment_intent.succeeded":
      return await paymentCompletedAndUpdateStatus(req, res, event.data.object);
    case "payment_intent.created":
      console.log(event);
      break;
    case "payment_intent.canceled":
      console.log(event);
      break;
    default:
      console.log(event.type);
      console.log(event);
  }
};

async function paymentCompletedAndUpdateStatus(req, res, data) {
  return db.sequelize.transaction(async (transaction) => {
    const {
      id: transactionId,
      metadata: { buyerId, orderId },
    } = data;
    const requestBody = JSON.parse(req.body.toString());
    const tempOrderData = await commonFunctions.findByPk(db.tempOrder, orderId);
    if (!tempOrderData) {
      throw new BadRequestError("Temp Order Doest not exist");
    }
    if (tempOrderData.status !== "initiated") {
      throw new BadRequestError("Order Already Processed");
    }
    const orderBody = {
      tempOrderId: tempOrderData.id,
      buyerId: tempOrderData.buyerId,
      type: tempOrderData.type,
      serviceId: tempOrderData.serviceId,
      serviceInterestId: tempOrderData.serviceInterestId,
      subscriptionPlanId: tempOrderData.subscriptionPlanId,
      taxAmount: tempOrderData.taxAmount,
      amount: tempOrderData.amount,
      totalAmount: tempOrderData.totalAmount,
      paymentStatus: payment_status_enums.paid,
      orderNumber: crypto.randomUUID(),
    };
    const order = await commonFunctions.create(
      db.order,
      orderBody,
      false,
      transaction
    );

    if (order.serviceInterestId) {
      await commonFunctions.update(
        db.serviceInterest,
        { id: order.serviceInterestId },
        { unlockedAt: new Date() },
        null,
        transaction
      );
    } else if (order.subscriptionPlanId) {
      const subscriptionPlanData = await commonFunctions.findByPk(
        db.subscriptionPlan,
        order.subscriptionPlanId
      );
      const subscriptionDataBody = {
        subscriptionPlanId: subscriptionPlanData.id,
        orderId: order.id,
        subscriberId: buyerId,
        startDate: new Date(),
        endDate: moment().add(subscriptionPlanData.duration, "months").toDate(),
        taxAmount: order.taxAmount,
        amount: order.amount,
        totalAmount: order.totalAmount,
        paymentStatus: payment_status_enums.paid,
      };
      await commonFunctions.create(
        db.subscription,
        subscriptionDataBody,
        false,
        transaction
      );
    }
    const paymentData = {
      invoiceNo: crypto.randomUUID(),
      transactionId,
      orderId: order.id,
      request: JSON.stringify(requestBody),
      response: JSON.stringify(data),
      paymentMode: "card",
      paymentGatewayRef: data["client_secret"],
      status: payment_status_enums.paid,
    };
    await commonFunctions.create(db.payment, paymentData, false, transaction);
    await commonFunctions.update(
      db.tempOrder,
      { id: tempOrderData.id },
      { status: "paid" }
    );
    sendEmailNotification(
      order.serviceInterestId,
      order.subscriptionPlanId,
      buyerId,
      orderBody.taxAmount,
      orderBody.totalAmount,
      orderBody.amount
    );
    return handleSuccess("Payment verified and order status updated", data);
  });
}

// TODO: use the enque here instead of manual replace
async function sendEmailNotification(
  serviceInterestId = null,
  subscriptionPlanId = null,
  buyerId,
  taxAmount,
  totalAmount,
  amount
) {
  if (serviceInterestId) {
    const serviceInterestData = await commonFunctions.findOne(
      db.serviceInterest,
      {
        condition: { id: serviceInterestId },
        include: [
          {
            model: db.serviceProvider,
            as: "serviceProvider",
            include: [
              {
                model: db.customer,
                as: "provider",
              },
            ],
          },
        ],
        raw: false,
      }
    );
    const emailTemplate = await commonFunctions.findOne(db.emailTemplate, {
      condition: { name: "servicePayment" },
    });
    const to = serviceInterestData?.serviceProvider?.provider?.email || null;
    if (emailTemplate && to) {
      const data = {};
      data["name"] =
        serviceInterestData?.serviceProvider?.businessName ||
        "No Bussiness Name" + " Service";
      data["quantity"] = 1;
      data["amount"] = amount;
      data["taxAmount"] = taxAmount;
      data["totalAmount"] = totalAmount;
      const filepath = await generatePaymentReceipt(data);
      const firstName =
        serviceInterestData?.serviceProvider?.provider?.firstName || null;
      const businessName =
        serviceInterestData?.serviceProvider?.businessName || null;
      if (firstName && businessName) {
        emailTemplate.html = emailTemplate.html
          .replace(/<<buyerName>>/g, firstName)
          .replace(/<<serviceName>>/g, businessName);
        sendEmail({
          to,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          filepath,
        });
      }
    }
  } else if (subscriptionPlanId) {
    const subscriptionType = await commonFunctions.findByPk(
      db.subscriptionPlan,
      subscriptionPlanId
    );
    const customerData = await commonFunctions.findByPk(db.customer, buyerId);
    const data = {};
    data["name"] =
      subscriptionType?.name || "No Subsrciption Name" + " Subscription";
    data["quantity"] = 1;
    data["amount"] = amount;
    data["taxAmount"] = taxAmount;
    data["totalAmount"] = totalAmount;
    const filepath = await generatePaymentReceipt(data);
    if (subscriptionType.type === "seller") {
      await sendSubscriptionEmail(
        "propertyListingSubscription",
        customerData,
        filepath
      );
    } else {
      await sendSubscriptionEmail(
        "serviceProviderSubscription",
        customerData,
        filepath
      );
    }
  }
}

async function sendSubscriptionEmail(name, customerData, filepath) {
  const emailTemplate = await commonFunctions.findOne(db.emailTemplate, {
    condition: { name },
  });
  if (emailTemplate && customerData) {
    emailTemplate.html = emailTemplate.html
      .replace(/<<buyerName>>/g, firstName)
      .replace(/<<duration>>/g, businessName);
    sendEmail({
      to: customerData.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      filepath,
    });
  }
}
