const { sequelize } = require("../src/models/index");

function DatabaseConnect() {
  sequelize
    .authenticate()
    .then(() => {
      console.log("✅ Database Connected Successfully!");
    })
    .catch((err) => {
      console.error(`🚨 Error connecting to database:\n${err.message}`);
      console.log("Retrying database connection in 5000ms...");
      setTimeout(DatabaseConnect, 5000);
    });
}

DatabaseConnect();
// Optional: development-only idle transaction watcher
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
