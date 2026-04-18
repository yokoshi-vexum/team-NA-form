const cron = require('node-cron');
const { getConfig } = require('../utils/config');
const { getChannelsWithTomorrowJochi } = require('../utils/goalStore');

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

      // フォームから登録された常駐日程をチェック
      const matches = getChannelsWithTomorrowJochi(tomorrow);

      for (const entry of matches) {
        try {
          const goalText = entry.goal
            ? `\n\n*📌 次回はどこまで終わらせるのが目標？*\n${entry.goal}`
            : '';

          await app.client.chat.postMessage({
            channel: entry.channelId,
            text: `明日は常駐日です`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `📅 明日 *${tomorrow}* は常駐日です。\nNAする方は準備・連絡をお願いします！${goalText}`,
                },
              },
            ],
          });
          console.log(`[Reminder] Posted for channel ${entry.channelId} (${tomorrow})`);
        } catch (err) {
          console.error(`[Reminder] Failed for channel ${entry.channelId}:`, err.message);
        }
      }
    },
    { timezone: config.timezone }
  );

  console.log(`[Scheduler] 常駐前日リマインダー起動 (毎日 ${config.reminderTime} ${config.timezone})`);
}

module.exports = { startReminderScheduler };
