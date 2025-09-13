const client = require("./redis");

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

exports.getUserTokenDetails = (userId) =>
  getJson(`USER_TOKEN_${userId}`);

exports.setUserTokenDetails = (userId, data, expiresIn) =>
  setJson(`USER_TOKEN_${userId}`, data, expiresIn);

exports.getCustomerTokenDetails = (userId) =>
  getJson(`CUSTOMER_TOKEN_${userId}`);

exports.setCustomerTokenDetails = (userId, data, expiresIn) =>
  setJson(`CUSTOMER_TOKEN_${userId}`, data, expiresIn);

exports.getUserDetails = (userId) =>
  getJson(`USER_${userId}`);

exports.setUserDetails = (userId, data, expiresIn) =>
  setJson(`USER_${userId}`, data, expiresIn);

exports.getCustomerDetails = (userId) =>
  getJson(`CUSTOMER_${userId}`);

exports.setCustomerDetails = (userId, data, expiresIn) =>
  setJson(`CUSTOMER_${userId}`, data, expiresIn);

exports.getAddressDetails = (addressId) =>
  getJson(`ADDRESS_${addressId}`);

exports.setAddressDetails = (addressId, data, expiresIn) =>
  setJson(`ADDRESS_${addressId}`, data, expiresIn);

exports.removeAddressDetails = (addressId) =>
  remove(`ADDRESS_${addressId}`);
