const cron = require('node-cron');
const { getJochiDates, getConfig } = require('../utils/config');

function getTomorrowDateJST() {
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const jstNow = new Date(now.getTime() + jstOffset);
  jstNow.setUTCDate(jstNow.getUTCDate() + 1);
  return jstNow.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function startReminderScheduler(app) {
  const config = getConfig();
  const [hour, minute] = config.reminderTime.split(':');
  const cronExpression = `${minute} ${hour} * * *`;

  cron.schedule(
    cronExpression,
    async () => {
      const tomorrow = getTomorrowDateJST();
      const jochiDates = getJochiDates();
      const matches = jochiDates.filter((entry) => entry.date === tomorrow);

      for (const entry of matches) {
        try {
          await app.client.chat.postMessage({
            channel: entry.channelId,
            text: `📅 明日 *${entry.date}* は *${entry.clientName}* への常駐日です。\nNAする方は準備・連絡をお願いします！`,
          });
          console.log(`[Reminder] Posted for ${entry.clientName} (${entry.date})`);
        } catch (err) {
          console.error(`[Reminder] Failed to post for ${entry.clientName}:`, err.message);
        }
      }
    },
    {
      timezone: config.timezone,
    }
  );

  console.log(`[Scheduler] 常駐前日リマインダー起動 (毎日 ${config.reminderTime} ${config.timezone})`);
}

module.exports = { startReminderScheduler };
