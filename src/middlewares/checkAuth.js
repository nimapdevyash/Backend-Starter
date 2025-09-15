const { verifyToken } = require("../../utils/jwt");
const db = require("../models/index");
const commonFunctions = require("../../utils/commonFunctions");

const {
  getUserTokenDetails,
  setUserTokenDetails,
} = require("../../utils/cacheHandler");
const getRedisClient = require("../../utils/redis");
const { findOne } = require("../../utils/dbOperations");
const models = require("../models/index");

module.exports = async (req, res, next) => {
  try {
    // 1. Validate authorization header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return unauthorizedResponse(res);

    // 2. Extract access token
    const [scheme, accessToken] = authorizationHeader.split(" ");
    if (scheme !== "Bearer" || !accessToken) return unauthorizedResponse(res);

    // 3. Decode and validate JWT
    const decodedToken = verifyToken(accessToken);
    if (!decodedToken?.userId) return unauthorizedResponse(res);

    const userId = decodedToken.userId;

    // 4. Get Redis client (singleton)
    const redisClient = await getRedisClient();

    // 5. Try to get token record from Redis
    let cachedTokenRecord =
      redisClient?.isReady && (await getUserTokenDetails(userId));

    // 6. Fallback to database if not cached
    if (!cachedTokenRecord) {
      cachedTokenRecord = await findOne({ model: models.userToken, condition: { token: accessToken } });
      if (!cachedTokenRecord) return unauthorizedResponse(res);

      // 7. Store in Redis for next requests
      if (redisClient?.isReady) {
        await setUserTokenDetails(userId, cachedTokenRecord);
      }
    }

    // 8. Attach user info to request
    req.userData = {
      id: userId,
      userType: decodedToken.userType,
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return unauthorizedResponse(res);
  }
};

function unauthorizedResponse(res) {
  return res.status(401).json({ message: "Unauthorized" });
}
