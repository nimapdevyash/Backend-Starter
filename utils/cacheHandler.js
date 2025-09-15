const getRedisClient = require("./redis");

const client = getRedisClient();

async function getJson(key) {
  if (!client.isReady) return null;
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function setJson(key, value, expiresIn = 120) {
  if (!client.isReady) return;
  await client.set(key, JSON.stringify(value), { EX: expiresIn });
}

async function remove(key) {
  if (!client.isReady) return;
  await client.del(key);
}

// ----------------- USER TOKEN -----------------
exports.getUserTokenDetails = (userId) =>
  getJson(`USER_TOKEN_${userId}`);

// it only accepts seconds and 43200 is 12 hours
exports.setUserTokenDetails = ({userId, data, expiresIn = 43200 }) =>
  setJson(`USER_TOKEN_${userId}`, data, expiresIn);

exports.removeUserTokenDetails = (userId) =>
  remove(`USER_TOKEN_${userId}`);
