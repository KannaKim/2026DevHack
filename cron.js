import cron from "node-cron";
import fetch from "node-fetch"; // You may need to run `npm install node-fetch` if fetch isn't globally available in your node version

console.log("Starting cron job...");

// Run every minute: "* * * * *"
cron.schedule("* * * * *", async () => {
    console.log(`[${new Date().toISOString()}] Triggering /api/notifications...`);

    try {
        const response = await fetch("http://localhost:3001/api/notifications");
        const data = await response.json();

        console.log("Response:", data);
    } catch (error) {
        console.error("Error triggering notifications endpoint:", error);
    }
});
