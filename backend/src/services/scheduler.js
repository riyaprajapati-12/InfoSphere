const cron = require("node-cron");
const { fetchAndStoreArticles } = require("./rssFetcher");

let isRunning = false;

const startScheduler = () => {
  console.log("⏰ Scheduler Started");
fetchAndStoreArticles()
  cron.schedule("*/45 * * * *", async () => {
    if (isRunning) return;

    isRunning = true;
    try {
      await fetchAndStoreArticles();
    } finally {
      isRunning = false;
    }
  });
};

module.exports = { startScheduler };


