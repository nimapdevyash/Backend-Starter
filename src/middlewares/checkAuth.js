const { verifyToken } = require("../../utils/jwt");
const db = require("../models/index");
const commonFunctions = require("../../utils/commonFunctions");

const {
  getUserDetails,
  setUserDetails,
  getUserTokenDetails,
  setUserTokenDetails,
  getCustomerTokenDetails,
  setCustomerTokenDetails,
  getCustomerDetails,
  setCustomerDetails,
} = require("../../utils/cacheHandler");

module.exports = async (req, res, next) => {
  try {
   
    let accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return Unauthorized(res);
    }

    const decodedData = verifyToken(accessToken);
    if (!decodedData.userType) {
      let tokenDetails = await getUserTokenDetails(decodedData.userId);

      if (!tokenDetails) {
        tokenDetails = await commonFunctions.findOne(db.userToken, { condition: { token: accessToken }, });
        setUserTokenDetails(decodedData.userId, tokenDetails);
      }
      if (!tokenDetails) {
        return Unauthorized(res);
      }

      let userDetails = await getUserDetails(decodedData.userId);

      if (!userDetails) {
        userDetails = await commonFunctions.findByPk( db.user, tokenDetails.userId);
        setUserDetails(decodedData.userId, userDetails);
      }

      if (userDetails) {
        req.userData = {
          id: userDetails.id,
        };
        next();
      } else {
        return Unauthorized(res);
      }
    } else {
      let tokenDetails = await getCustomerTokenDetails(decodedData.userId);
      if (!tokenDetails) {
        tokenDetails = await commonFunctions.findOne(db.customerToken, { condition: { token: accessToken }, });
        setCustomerTokenDetails(decodedData.userId, tokenDetails);
      }
      if (!tokenDetails) {
        return Unauthorized(res);
      }

      let userDetails = await getCustomerDetails(tokenDetails.customerId);
      if (!userDetails) {
        userDetails = await commonFunctions.findByPk( db.customer, tokenDetails.customerId);
        setCustomerDetails(userDetails.id, userDetails);
      }
      if (userDetails) {
        req.userData = {
          id: userDetails.id,
        };
        next();
      } else {
        return Unauthorized(res);
      }
    }
  } catch (error) {
    return Unauthorized(res);
  }
};

function Unauthorized(res) {
  res.status(401).send({ message: "Unauthorized" });
}
