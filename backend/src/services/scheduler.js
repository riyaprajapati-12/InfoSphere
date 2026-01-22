const cron = require("node-cron");
const { fetchAndStoreArticles } = require("./rssFetcher");

let isRunning = false;

const startScheduler = () => {
  console.log("⏰ Scheduler Started (Every 5 Minutes)");
  
  // Server start hote hi pehli baar articles fetch karne ke liye
  fetchAndStoreArticles();

  // Har 5 minute mein run karne ke liye cron expression "*/5 * * * *"
  cron.schedule("*/5 * * * *", async () => {
    if (isRunning) {
      console.log("⚠️ Fetching cycle already in progress, skipping this run.");
      return;
    }

    isRunning = true;
    try {
      console.log("🔄 Starting 5-minute fetch cycle...");
      await fetchAndStoreArticles();
      console.log("✅ 5-minute fetch cycle complete");
    } catch (error) {
      console.error("❌ Scheduler Error during fetch:", error);
    } finally {
      isRunning = false;
    }
  });
};

module.exports = { startScheduler };