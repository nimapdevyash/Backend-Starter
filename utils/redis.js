// redisClient.js
const redis = require("redis");
require("dotenv").config();
const { toBool } = require("../utils/commonFunctions"); // your utility
const { CONSTANTS } = require("./constants");


let client;
let isConnected = false;

// cheak if the redis connection is enabled or not
if (toBool(CONSTANTS.REDIS.ENABLED )) {
  client = redis.createClient({
    socket: {
      host: CONSTANTS.REDIS.HOST,
      port: CONSTANTS.REDIS.PORT,
      reconnectStrategy: (retries) => {
        if (retries > CONSTANTS.REDIS.RETRIES) {
          console.error("❌ Redis reconnect failed after max retries");
          return new Error("Redis reconnect failed");
        }
        const delay = Math.min(retries * 100, Number(CONSTANTS.REDIS.DELAY));
        console.warn(`⚠️ Redis reconnect attempt #${retries}, waiting ${delay}ms`);
        return delay;
      },
    },
    password: CONSTANTS.REDIS.PASSWORD,
  });

  // Event listeners
  client.on("connect", () => console.log("🔌 Redis connecting..."));
  client.on("ready", () => console.log("✅ Redis ready"));
  client.on("error", (err) => console.error("❌ Redis error:", err));
  client.on("end", () => console.log("⚠️ Redis connection closed"));

  // Graceful shutdown handling
  process.on("SIGINT", async () => {
    if (isConnected) {
      await client.quit();
      console.log("👋 Redis client disconnected (SIGINT)");
    }
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    if (isConnected) {
      await client.quit();
      console.log("👋 Redis client disconnected (SIGTERM)");
    }
    process.exit(0);
  });
}

/**
 * Ensures a single Redis connection is established and reused
 * @returns {Promise<import('redis').RedisClientType|null>}
 */
async function getRedisClient() {
  if (CONSTANTS.REDIS.ENABLED) {
    console.warn("⚠️ Redis is disabled via env");
    return null;
  }

  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("🚀 Connected to Redis");
    } catch (err) {
      console.error("❌ Failed to connect to Redis:", err);
      throw err;
    }
  }

  return client;
}

module.exports = getRedisClient;
