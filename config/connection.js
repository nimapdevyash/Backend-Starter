const { sequelize } = require('../src/models/index');
const DB = require('./config');

const syncOptions = {
  alter: DB.SYNC === 'ALTER',
  force: DB.SYNC === 'FORCE'
};

// this function will try reconnecting the db every 5 seconds when not connected
function DatabaseConnect() {
  sequelize.sync(syncOptions).then(() => {
    console.log('Database Connected ✔✔✔');
  }).catch((err) => {
    console.log(`🚨🚨🚨 Error While Connecting Database\n${err}\nRetry Database Connection after 5000ms\n`);
    setTimeout(() => {
      DatabaseConnect();
    }, 5000);
  });
}

DatabaseConnect();

/**
 * NOTE: this is only for the development
 * - it checks and logs the idle transactions which might not be closed
*/

// checks for idle transactions
exports.idleTransactionsWatcher = () =>
  setInterval(async () => {
    try {
      const [results] = await sequelize.query(`
      SELECT pid, state, query, now() - xact_start AS open_for
      FROM pg_stat_activity
      WHERE state = 'idle in transaction'
    `);

      if (results.length) {
        console.warn("⚠️ Idle transactions detected:", results);
      }
    } catch (err) {
      console.error("Error while checking idle transactions:", err.message);
    }
  }, 30000);

